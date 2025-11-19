// src/pages/Users.jsx
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useUsers";
import { useToolbar } from "../store/toolbar";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ------------------------- helpers ------------------------- */
const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);
const cls = (...xs) => xs.filter(Boolean).join(" ");

function useDebouncedCallback(callback, delay) {
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);
  const timerRef = useRef(null);
  return useMemo(
    () => (value) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => cbRef.current(value), delay);
    },
    [delay]
  );
}

/* ------------------------- confirm dialog ------------------------- */
function ConfirmDialog({
  open,
  title,
  desc,
  confirmText = "Delete",
  onCancel,
  onConfirm,
  busy,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
        <div className="text-lg font-semibold mb-1">{title}</div>
        {desc && <p className="text-sm text-slate-600 mb-4">{desc}</p>}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-md text-white ${
              busy ? "bg-rose-300" : "bg-rose-600 hover:bg-rose-700"
            }`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- badges ------------------------- */
function StatusBadge({ value }) {
  const v = String(value || "").toLowerCase();
  const map = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      dot: "bg-emerald-500",
      label: "Active",
    },
    inactive: {
      bg: "bg-red-50",
      text: "text-red-600",
      ring: "ring-red-200",
      dot: "bg-red-400",
      label: "Inactive",
    },
  };
  const cfg = map[v] ?? map.inactive;
  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        "ring-1",
        cfg.ring,
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cls("inline-block h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
function RoleBadge({ value }) {
  const v = String(value || "").toLowerCase();
  const map = {
    admin: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      label: "Admin",
    },
    manager: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      label: "Manager",
    },
    sales: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-200",
      label: "Sales",
    },
    "sales-agent": {
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-200",
      label: "Sales Agent",
    },
    "sales-executive": {
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-200",
      label: "Sales Executive",
    },
    "sales-director": {
      bg: "bg-pink-50",
      text: "text-pink-600",
      ring: "ring-pink-200",
      label: "Sales Director",
    },
    warehouse: {
      bg: "bg-lime-50",
      text: "text-lime-600",
      ring: "ring-lime-200",
      label: "Warehouse",
    },
    shipping: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      label: "Shipping",
    },
    employee: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      label: "Employee",
    },
    qc: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      ring: "ring-purple-200",
      label: "QC",
    },
    "executive-assistant": {
      bg: "bg-zinc-50",
      text: "text-zinc-700",
      ring: "ring-zinc-200",
      label: "Executive Assistant",
    },
  };
  const cfg = map[v] ?? {
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-200",
    label: v ? v[0].toUpperCase() + v.slice(1) : "—",
  };
  return (
    <span
      className={cls(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        "ring-1",
        cfg.ring,
        cfg.bg,
        cfg.text
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ------------------------- pretty checkbox ------------------------- */
function NiceCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cls(
          "h-4 w-4 rounded border ring-1 flex items-center justify-center",
          checked
            ? "bg-slate-900 border-slate-900 ring-slate-900"
            : "bg-white border-slate-300 ring-slate-200"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className={cls(
            "h-3 w-3",
            checked ? "text-white opacity-100" : "opacity-0"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

/* ------------------------- filter dropdown ------------------------- */
function FilterDropdown({ open, onClose, value, onChange }) {
  const rolesAll = [
    "admin",
    "manager",
    "employee",
    "sales",
    "sales-agent",
    "sales-executive",
    "warehouse",
    "shipping",
    "qc",
    "executive-assistant"
  ];
  if (!open) return null;
  return (
    <div
      className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">Filters</div>
      </div>
      <div className="p-3 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Status
          </div>
          <div className="flex items-center gap-4">
            <NiceCheckbox
              label="Active"
              checked={value.statuses.includes("active")}
              onChange={(ck) =>
                onChange({
                  ...value,
                  statuses: ck
                    ? [...value.statuses, "active"]
                    : value.statuses.filter((s) => s !== "active"),
                })
              }
            />
            <NiceCheckbox
              label="Inactive"
              checked={value.statuses.includes("inactive")}
              onChange={(ck) =>
                onChange({
                  ...value,
                  statuses: ck
                    ? [...value.statuses, "inactive"]
                    : value.statuses.filter((s) => s !== "inactive"),
                })
              }
            />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Roles
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {rolesAll.map((r) => (
              <NiceCheckbox
                key={r}
                label={r
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (m) => m.toUpperCase())}
                checked={value.roles.includes(r)}
                onChange={(ck) =>
                  onChange({
                    ...value,
                    roles: ck
                      ? [...value.roles, r]
                      : value.roles.filter((x) => x !== r),
                  })
                }
              />
            ))}
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between">
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={() => onChange({ statuses: [], roles: [] })}
          >
            Clear all
          </button>
          <button
            className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-black"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- custom pagination ------------------------- */
function PgBtn({ active, disabled, children, onClick }) {
  const base =
    "inline-flex items-center justify-center h-8 min-w-[2rem] rounded-full border text-sm transition";
  const classes = disabled
    ? "cursor-not-allowed opacity-50 bg-white border-slate-200 text-slate-400"
    : active
    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
  return (
    <button
      className={`${base} ${classes} px-2`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function makePageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5];
  if (current >= total - 2)
    return [total - 4, total - 3, total - 2, total - 1, total];
  return [current - 2, current - 1, current + 1, current + 2];
}

function PaginationBar({
  total = 0,
  pageSize = 20,
  currentPage = 1,
  onChangePage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div
      className="
        fixed bottom-20 lg:left-[60%] xl:left-[56%] -translate-x-1/2 z-10
        w-[650px] mx-auto
        bg-white/95 backdrop-blur-[1px]
        border-t border-slate-200
        rounded-[20px]
        shadow-[0_-4px_12px_rgba(2,6,23,0.04)]
      "
    >
      <div className="h-12 grid grid-cols-3 items-center gap-2 px-3">
        {/* LEFT: range */}
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span>
          <span className="mx-1">of</span>
          <span className="font-semibold">{total}</span>
        </div>

        {/* CENTER: buttons */}
        <div className="flex items-center justify-center gap-2">
          <PgBtn
            disabled={currentPage <= 1}
            onClick={() => onChangePage(currentPage - 1)}
          >
            <FaArrowLeft />
          </PgBtn>

          {pages[0] > 1 && (
            <>
              <PgBtn onClick={() => onChangePage(1)}>1</PgBtn>
              {pages[0] > 2 && <span className="px-1 text-slate-400">…</span>}
            </>
          )}

          {pages.map((p) => (
            <PgBtn
              key={p}
              active={p === currentPage}
              onClick={() => onChangePage(p)}
            >
              {p}
            </PgBtn>
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="px-1 text-slate-400">…</span>
              )}
              <PgBtn onClick={() => onChangePage(totalPages)}>
                {totalPages}
              </PgBtn>
            </>
          )}

          <PgBtn
            disabled={currentPage >= totalPages}
            onClick={() => onChangePage(currentPage + 1)}
          >
            <FaArrowRight />
          </PgBtn>
        </div>

        {/* RIGHT: current page */}
        <div className="text-right text-sm text-slate-700">
          Page: <span className="font-semibold">{currentPage}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- page ------------------------- */
export default function Users() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ statuses: [], roles: [] });
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

  useToolbar({
    title: "Users",
    searchPlaceholder: "Search users…",
    onSearch: debouncedSearch,
    actions: [
      {
        label: "Filter",
        variant: "ghost",
        onClick: () => setFilterOpen((o) => !o),
      },
      { label: "+ Add", variant: "primary", to: "/users/new" },
    ],
    backButton: true,  
  });

  const pageForServer = paginationModel.page + 1;
  const { data, isLoading, isFetching } = useUsers(
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  );

  // DELETE mutation + confirm state
  const { mutateAsync: deleteMutate, isLoading: deleting } = useDeleteUser();
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
      // Optional: if last item on page deleted, go previous page
      setPaginationModel((m) => ({ ...m })); // trigger refetch via invalidate
    } catch (e) {
      // Optionally show toast
      console.error("Delete failed:", e?.message || e);
      closeConfirm();
    }
  };

  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 180,
        valueFormatter: (value, row) =>
          dash(
            value ||
              [row?.firstName, row?.lastName].filter(Boolean).join(" ") ||
              row?.username
          ),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 220,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 150,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "hourlyRate",
        headerName: "Hourly Rate",
        width: 150,
        valueFormatter: (v) => dash(v),
      },
      {
        field: "role",
        headerName: "Role",
        width: 160,
        renderCell: (p) => <RoleBadge value={p.value} />,
        valueGetter: (v) => v,
      },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (p) => <StatusBadge value={p.value} />,
        valueGetter: (v) => v,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const row = params.row;
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
                  navigate(`/users/${row._id}`);
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
      <div className="fixed right-3 z-[999]">
        <FilterDropdown
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          value={filters}
          onChange={applyFilters}
        />
      </div>

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
                  : { page: model.page, pageSize: 20 }
              )
            }
            pageSizeOptions={[20]}
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            filterMode="server"
            hideFooterPagination
            hideFooterSelectedRowCount
            /* 👇 navigate when a row is clicked */
            onRowClick={(params) => {
              // params.id === result of getRowId -> row._id
              navigate(`/user-details/${params.id}`);
            }}
            /* 👇 pointer cursor + subtle hover */
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
        title="Delete user?"
        desc={`Are you sure you want to delete "${
          target?.name || target?.email || "this user"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        onCancel={closeConfirm}
        onConfirm={handleConfirmDelete}
        busy={deleting}
      />
    </div>
  );
}
