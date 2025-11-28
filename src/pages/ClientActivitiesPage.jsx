// src/pages/Activities.jsx
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { FiEdit2, FiMail, FiPhone, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { useToolbar } from "../store/toolbar";
import {
  useActivitiesByClientId, useActivitiesByUserId, // GET (server-side pagination + filters)
  useDeleteActivity, // DELETE
} from "../hooks/useActivities";

import ConfirmDialog from "../components/activities/ConfirmDialog";
import TypeBadge from "../components/activities/TypeBadge";
import FilterDropdown from "../components/activities/FilterDropdown";
import PaginationBar from "../components/activities/PaginationBar";
import { useDebouncedCallback } from "../components/activities/useDebouncedCallback";
import { dash, fmtDate } from "../components/activities/utils";
import { MdOutlineTextSnippet } from "react-icons/md";

export default function ClientActivitiesPage({ isUserId = false }) {
  const navigate = useNavigate();

  // pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const pageForServer = paginationModel.page + 1;

  // search + filters
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    datePreset: null,
  }); // types: ['call','email']
  const [filterOpen, setFilterOpen] = useState(false);

  // debounced search
  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);

    // reset page to 0 if user is not already on it
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

  
  const { id } = useParams();
  
  // data fetch
  const { data, isLoading, isFetching } = isUserId ? useActivitiesByUserId(
    id,
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  ) : useActivitiesByClientId(
    id,
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  );

  // toolbar config
  useToolbar({
    title: `${`${isUserId ? data?.rows[0].userId : data?.rows[0]?.clientId} Activities` || "Client Activities"}`,
    searchPlaceholder: "Search activities…",
    onSearch: debouncedSearch,
    actions: [
      {
        label: "Filter",
        variant: "ghost",
        onClick: () => setFilterOpen((o) => !o),
      },
      {
        label: "+ Add",
        variant: "primary",
        to: "/activities/new",
      },
    ],
    backButton: true,
  });

  // delete logic + confirm modal state
  const { mutateAsync: deleteMutate, isLoading: deleting } =
    useDeleteActivity();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);

  const openConfirm = (row) => {
    setTarget(row);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setTarget(null);
  };
  const handleConfirmDelete = async () => {
    if (!target?._id) return;
    try {
      await deleteMutate(target._id);
      closeConfirm();

      // refetch by nudging pagination state
      setPaginationModel((m) => ({ ...m }));
    } catch (e) {
      console.error("Delete failed:", e?.message || e);
      closeConfirm();
    }
  };

  // filter apply
  const applyFilters = useCallback((next) => {
    setFilters(next);

    // reset to first page whenever filters change
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  // table columns
  const columns = useMemo(
    () => [
      {
        field: "type",
        headerName: "Type",
        width: 60,
        sortable: false,
        renderCell: ({ value }) => {
          const t = String(value || "").toLowerCase();

          const icon =
            t === "call" || t === "call_made" ? <FiPhone className="text-green-600" size={16} /> :
              t === "email" ? <FiMail className="text-rose-600" size={16} /> :
                <MdOutlineTextSnippet className="text-sky-600" size={16} />;

          return (
            <div className="flex items-center gap-2 mt-4">
              {icon}
            </div>
          );
        },
        // no need for valueGetter here
      },
      { field: "createdAt", headerName: "Date", width: 120, renderCell: (p) => <div className="mt-4">{p.row.createdAt?.split(" ")[0]?.split("T")[0] || p.row.createdAt?.split("T")[0]}</div> },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 260,
        sortable: false,
        renderCell: (p) => (
          <div className="wrapText">
            {p.value || "—"}
          </div>
        ),
      },
      // {
      //   field: "clientId",
      //   headerName: "Client",
      //   width: 160,
      //   renderCell: (p) => <span className="block">{p.value || "—"}</span>,
      // },
      {
        field: "userId",
        headerName: "User",
        width: 220,
        renderCell: (p) => <span className="block">{p.value || "—"}</span>,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const row = params?.row;
          const stop = (e) => {
            e.stopPropagation();
            e.preventDefault();
          };
          return (
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-slate-100"
                title="Edit"
                onClick={(e) => {
                  stop(e);
                  navigate(`/activities/${row._id}`);
                }}
              >
                <FiEdit2 size={16} />
              </button>
              <button
                className="p-1 rounded hover:bg-red-50"
                title="Delete"
                onClick={(e) => {
                  stop(e);
                  openConfirm(row);
                }}
              >
                <FiTrash2 size={16} className="text-red-600" />
              </button>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <div className="relative users_table">
      {/* floating filter card */}
      <div className="relative">
        <FilterDropdown
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          value={filters}
          onChange={applyFilters}
        />
      </div>

      {/* loader vs table */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center h-[60vh]">
          <ClipLoader size={42} />
        </div>
      ) : (
        <div className="h-screen relative pb-8">
          <DataGrid
            columns={columns}
            rows={data?.rows ?? []}
            getRowId={(row) => row._id}
            loading={isFetching}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={(model) =>
              setPaginationModel((prev) =>
                prev.page === model.page && prev.pageSize === model.pageSize
                  ? prev
                  : {
                    page: model.page,
                    pageSize: 100,
                  }
              )
            }
            getRowHeight={() => 'auto'}
            getEstimatedRowHeight={() => 56}
            pageSizeOptions={[100]}
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            filterMode="server"
            hideFooterPagination
            hideFooterSelectedRowCount
            // onRowClick={(params) =>
            //   navigate(`/activity-details/${params.id}`)
            // }
            sx={{
              border: "none",
              "& .MuiDataGrid-row": { cursor: "pointer" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
              "& .MuiDataGrid-cell": { alignItems: "flex-start" },
              '& .MuiDataGrid-cell[data-field="clientId"], \
                 .MuiDataGrid-cell[data-field="userId"]': {
                paddingTop: "1rem",   // mt-4 equivalent
              },

              // MULTI-LINE support:
              "& .wrapText": {
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflow: "visible",
                textOverflow: "clip",
                display: "block",
                paddingTop: "18px",
                paddingBottom: "18px",
                lineHeight: 1.4,
              },
              // cells ko top-align karein taake multi-line acha lage
              "& .MuiDataGrid-cell": { alignItems: "flex-start" },

              // MUI ke internal max-heights ko relax
              "& .MuiDataGrid-row, & .MuiDataGrid-cell": {
                maxHeight: "none !important",
              },
            }}
          />

          <PaginationBar
            total={data?.meta?.total ?? 0}
            pageSize={paginationModel.pageSize}
            currentPage={(paginationModel.page ?? 0) + 1}
            onChangePage={(newPage1) =>
              setPaginationModel((prev) => ({
                ...prev,
                page: Math.max(0, newPage1 - 1),
              }))
            }
          />
        </div>
      )}

      {/* confirm modal */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete activity?"
        desc={`Are you sure you want to delete activity "${target?.description || target?._id || ""
          }"? This action cannot be undone.`}
        confirmText="Delete"
        onCancel={closeConfirm}
        onConfirm={handleConfirmDelete}
        busy={deleting}
      />
    </div>
  );
}
