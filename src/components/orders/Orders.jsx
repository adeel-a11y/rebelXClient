// src/pages/OrdersPage.jsx
import React, { useMemo, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";

import { useToolbar } from "../../store/toolbar";
import { useClientOrdersLists, useDeleteOrder, useOrdersLists } from "../../hooks/useOrders";
import PaginationBar from "../../components/activities/PaginationBar";
import { useDebouncedCallback } from "../../components/activities/useDebouncedCallback";
import { dash, fmtDate } from "../../components/activities/utils";
import OrderFilterDropdown from "../../components/orders/OrderFilterDropdown";
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
            className={`px-3 py-1.5 rounded-md text-white ${confirming ? "bg-rose-300" : "bg-rose-600 hover:bg-rose-700"
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

export default function OrdersPage({ externalId = "" }) {
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

  
  // data
  const { data, isLoading, isFetching } = externalId ? useClientOrdersLists(externalId, {
    page: pageForServer,
    limit: paginationModel.pageSize,
    q: query,
    statuses: filters.statuses,
    datePreset: filters.datePreset,
  }) : useOrdersLists({
    page: pageForServer,
    limit: paginationModel.pageSize,
    q: query,
    statuses: filters.statuses,
    datePreset: filters.datePreset,
  });

  console.log(data.data);

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
  
  // local apply filters
  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  const location = useLocation();

  // toolbar
  useToolbar({
    title: `${location.pathname.includes("client-orders") ? `${data?.data[0]?.Client}` : "Sales"} Orders`,
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


  // columns
  const columns = useMemo(
    () => [
      { field: "Label", headerName: "Order #", width: 120 },
      {
        field: "ClientID",
        headerName: "Client",
        width: 220,
        // valueFormatter: (v) => dash(v),
      },
      {
        field: "TimeStamp",
        headerName: "Date",
        width: 200,
        renderCell: (p) => p?.value?.split("T")[0]?.slice(0, 10),
      },
      {
        field: "SalesRep",
        headerName: "Sales Rep",
        width: 220,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "Discount",
        headerName: "Discount",
        width: 140,
        sortable: true,
        renderCell: (p) => {
          const v = Number(p?.value ?? 0);
          const has = v > 0;
          const text = `-${v.toFixed(2)}%`;

          return (
            <span
              title={has ? text : "-0.00%"}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1",
                has
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-slate-50 text-slate-600 ring-slate-200",
                "shadow-[0_1px_0_rgba(2,6,23,0.04)]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-1.5 w-1.5 rounded-full",
                  has ? "bg-emerald-500" : "bg-slate-400",
                ].join(" ")}
              />
              {has ? text : "0"}
            </span>
          );
        },
      },
      {
        field: "Tax",
        headerName: "Tax",
        width: 160,
        renderCell: (p) => {
          const v = Number(p?.value ?? 0);
          const has = v > 0;
          const tax = `$${v.toFixed(2)}`;

          return (
            <span
              title={has ? tax : "-0.00%"}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1",
                has
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : "bg-slate-50 text-slate-600 ring-slate-200",
                "shadow-[0_1px_0_rgba(2,6,23,0.04)]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-1.5 w-1.5 rounded-full",
                  has ? "bg-rose-500" : "bg-slate-400",
                ].join(" ")}
              />
              {has ? tax : "0"}
            </span>
          );
        },
      },
      {
        field: "ShippingCost",
        headerName: "Shipping Cost",
        width: 160,
        renderCell: (p) => {
          const v = Number(p?.value ?? 0);
          const has = v > 0;
          const shipping = `$${v.toFixed(2)}`;

          return (
            <span
              title={has ? shipping : "0.00"}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1",
                has
                  ? "bg-yellow-50 text-yellow-700 ring-yellow-200"
                  : "bg-slate-50 text-slate-600 ring-slate-200",
                "shadow-[0_1px_0_rgba(2,6,23,0.04)]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-1.5 w-1.5 rounded-full",
                  has ? "bg-yellow-500" : "bg-slate-400",
                ].join(" ")}
              />
              {has ? shipping : "0"}
            </span>
          );
        },
      },
      {
        field: "Total",
        headerName: "Total",
        width: 160,
        renderCell: (p) => <div>${p?.value.toFixed(2)}</div>,
      },
      {
        field: "GrandTotal",
        headerName: "Grand Total",
        width: 160,
        renderCell: (p) => <div>${p?.value.toFixed(2)}</div>,
      },
      {
        field: "OrderStatus",
        headerName: "Status",
        width: 160,
        renderCell: (p) => <StatusCell value={p.value} />,
        valueGetter: (v) => v,
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
    <div className="relative users_table">
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
        <div className="h-auto relative pb-8">
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