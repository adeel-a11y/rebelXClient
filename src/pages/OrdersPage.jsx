// src/pages/OrdersPage.jsx
import React, { useMemo, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import { useToolbar } from "../store/toolbar";
import { useDeleteOrder, useOrdersLists } from "../hooks/useOrders";
import PaginationBar from "../components/activities/PaginationBar";
import { useDebouncedCallback } from "../components/activities/useDebouncedCallback";
import { dash, fmtDate } from "../components/activities/utils";
import OrderFilterDropdown from "../components/orders/OrderFilterDropdown";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

/* ----------------------------- helpers ----------------------------- */

const ORDER_STATUS_COLORS = {

  pending: "bg-amber-100 text-amber-800 border-amber-200",
  "pending-payment": "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipping: "bg-sky-100 text-sky-800 border-sky-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  issued: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  returned: "bg-slate-100 text-slate-800 border-slate-200",
};


const pretty = (s = "") =>
    String(s)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());

function StatusCell({ value }) {
    const key = String(value || "").toLowerCase();
    const cls =
        ORDER_STATUS_COLORS[key] ||
        "bg-slate-100 text-slate-700 border-slate-200";
    return (
        <span
            className={`inline-flex items-center px-2 py-[2px] rounded-full text-xs border ${cls}`}
            title={pretty(value)}
        >
            {pretty(value)}
        </span>
    );
}

/* ------------------------- tiny Confirm Dialog ------------------------- */
function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirming = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
        <div className="text-lg font-semibold mb-1">{title}</div>
        {message ? (
          <p className="text-sm text-slate-600 mb-4">{message}</p>
        ) : null}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
            disabled={confirming}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-md text-white ${
              confirming ? "bg-rose-300" : "bg-rose-600 hover:bg-rose-700"
            }`}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- component ----------------------------- */

export default function OrdersPage() {
  const navigate = useNavigate();

  // pagination (server expects 1-based)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const pageForServer = paginationModel.page + 1;

  // search + filters
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    statuses: [], // array of status strings
    datePreset: null, // 'today'|'this_month'|'this_year'|'prev_year'|null
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirm, setConfirm] = useState({
    open: false,
    row: null,
    error: "",
    nonce: null,
  });

  // debounced search
  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

  // toolbar
  useToolbar({
    title: "Sales Orders",
    searchPlaceholder: "Search orders…",
    onSearch: debouncedSearch,
    actions: [
      {
        label: "Filter",
        variant: "ghost",
        onClick: () => setFilterOpen((o) => !o),
      },
      { label: "+ Add", variant: "primary", to: "/orders/new" },
    ],
    backButton: true,
  });

  // data
  const { data, isLoading, isFetching } = useOrdersLists({
    page: pageForServer,
    limit: paginationModel.pageSize,
    q: query,
    statuses: filters.statuses,
    datePreset: filters.datePreset,
  });

  const { mutateAsync: deleteOrder, isPending: deleting } = useDeleteOrder();

  const openConfirm = (row) =>
    setConfirm({
      open: true,
      row,
      error: "",
      nonce: Math.random().toString(36).slice(2),
    });

  const closeConfirm = () =>
    setConfirm({ open: false, row: null, error: "", nonce: null });

  const handleConfirmDelete = async () => {
    if (!confirm.row?._id) return;
    try {
      await deleteOrder(confirm.row._id);
    } finally {
      closeConfirm();
    }
  };

  // if your getOrdersLists supports params, forward them:
  // queryFn: ({ signal }) => getOrdersLists({
  //   page: pageForServer, limit: paginationModel.pageSize,
  //   q: query, statuses: filters.statuses, datePreset: filters.datePreset, signal
  // })

  // local apply filters
  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  // columns
  const columns = useMemo(
    () => [
      { field: "OrderID", headerName: "Order #", width: 120 },
      {
        field: "ClientID",
        headerName: "Client",
        width: 220,
        // valueFormatter: (v) => dash(v),
      },
      {
        field: "SalesRep",
        headerName: "Sales Rep",
        width: 220,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "OrderStatus",
        headerName: "Status",
        width: 160,
        renderCell: (p) => <StatusCell value={p.value} />,
        valueGetter: (v) => v,
      },
      { field: "City", headerName: "City", width: 160, valueFormatter: dash },
      { field: "State", headerName: "State", width: 140, valueFormatter: dash },
      {
        field: "LockPrices",
        headerName: "Lock Prices",
        width: 140,
        renderCell: (p) => (
          <div>
            {p.value === "FALSE" ? (
              <span className="inline-flex items-center px-2 py-[2px] rounded-full text-xs border bg-rose-100 text-rose-800 border-rose-200">
                {p.value}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-[2px] rounded-full text-xs border bg-sky-100 text-sky-800 border-sky-200">
                {p.value}
              </span>
            )}
          </div>
        ),
      },
      {
        field: "TimeStamp",
        headerName: "Date",
        width: 200,
        renderCell: (p) => p?.value?.split("T")[0],
      },
      {
        field: "actions",
        headerName: <span className="flex w-[215px] justify-end">Actions</span>,
        minWidth: 240,
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
            <div className="flex items-center justify-end gap-2">
              <button
                className="p-1 rounded hover:bg-slate-100"
                title="Edit"
                onClick={(e) => {
                  stop(e);
                  navigate(`/orders/${row._id}`);
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
    <div className="relative shadow-sm overflow-hidden">
      <ConfirmDialog
        open={confirm.open}
        title="Delete Order?"
        message={
          confirm.row
            ? `This will permanently remove "${confirm.row.name || "Unnamed"}".`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
      />

      {/* filter popover */}
      <div className="relative">
        <OrderFilterDropdown
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
        <div className="h-[calc(100vh-90px)] relative">
          <DataGrid
            columns={columns}
            rows={data?.data ?? []}
            // backend returns no _id in projection; use OrderID as key
            getRowId={(row) => row.OrderID}
            loading={isFetching}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={(model) =>
              setPaginationModel((prev) =>
                prev.page === model.page && prev.pageSize === model.pageSize
                  ? prev
                  : { page: model.page, pageSize: 100 }
              )
            }
            pageSizeOptions={[100]}
            onRowClick={(params) => {
              console.log("params", params)
              navigate(`/order-details/${params?.row?._id}`);
            }}
            paginationMode="server"
            rowCount={data?.pagination?.totalDocs ?? 0}
            filterMode="server"
            hideFooterPagination
            hideFooterSelectedRowCount
            sx={{
              border: "none",
              "& .MuiDataGrid-row": { cursor: "pointer" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          />

          <PaginationBar
            total={data?.pagination?.totalDocs ?? 0}
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
    </div>
  );
}