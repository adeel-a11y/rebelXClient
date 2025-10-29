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
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { useToolbar } from "../store/toolbar";
import {
  useActivitiesByClientId, // GET (server-side pagination + filters)
  useDeleteActivity, // DELETE
} from "../hooks/useActivities";

import ConfirmDialog from "../components/activities/ConfirmDialog";
import TypeBadge from "../components/activities/TypeBadge";
import FilterDropdown from "../components/activities/FilterDropdown";
import PaginationBar from "../components/activities/PaginationBar";
import { useDebouncedCallback } from "../components/activities/useDebouncedCallback";
import { dash, fmtDate } from "../components/activities/utils";

export default function ClientActivitiesPage() {
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

  // toolbar config
  useToolbar({
    title: "Client Activities",
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

  const { id } = useParams();

  console.log("id", id);
  console.log("query", query);
  console.log("filters", filters);
  console.log("paginationModel", paginationModel);

  // data fetch
  const { data, isLoading, isFetching } = useActivitiesByClientId(
    id,
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  );

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
        field: "createdAt",
        headerName: "Date/Time",
        width: 190,
        valueFormatter: (v) => fmtDate(v),
      },
      {
        field: "type",
        headerName: "Type",
        width: 120,
        renderCell: (p) => <TypeBadge value={p.value} />,
        valueGetter: (v) => v,
      },
      {
        field: "clientId",
        headerName: "Client",
        width: 160,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "userId",
        headerName: "User",
        width: 220,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 260,
        valueFormatter: (v) => dash(v),
      },
      { field: "createdAt", headerName: "Date", width: 220, valueFormatter: (v) => fmtDate(v) },
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
        <div className="h-[calc(100vh-90px)] pb-16">
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
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
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
        desc={`Are you sure you want to delete activity "${
          target?.description || target?._id || ""
        }"? This action cannot be undone.`}
        confirmText="Delete"
        onCancel={closeConfirm}
        onConfirm={handleConfirmDelete}
        busy={deleting}
      />
    </div>
  );
}
