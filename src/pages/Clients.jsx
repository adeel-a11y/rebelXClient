// ---- src/pages/Clients.jsx ----
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { useClients } from "../hooks/useClients";
import { useToolbar } from "../store/toolbar";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ------------------------- helpers ------------------------- */
const cls = (...xs) => xs.filter(Boolean).join(" ");

// debounce (no lodash)
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

/* ------------------------- status badge ------------------------- */
function StatusBadge({ value }) {
  const v = String(value || "").toLowerCase();
  const map = {
    new: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      dot: "bg-sky-500",
      label: "New",
    },
    contacted: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      dot: "bg-indigo-500",
      label: "Contacted",
    },
    qualified: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      dot: "bg-emerald-500",
      label: "Qualified",
    },
    proposal: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      dot: "bg-amber-500",
      label: "Proposal",
    },
    negotiating: {
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      ring: "ring-fuchsia-200",
      dot: "bg-fuchsia-500",
      label: "Negotiating",
    },
    won: {
      bg: "bg-green-50",
      text: "text-green-700",
      ring: "ring-green-200",
      dot: "bg-green-500",
      label: "Won",
    },
    lost: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      dot: "bg-rose-500",
      label: "Lost",
    },
    cold: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      ring: "ring-slate-200",
      dot: "bg-slate-400",
      label: "Cold",
    },
    warm: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      ring: "ring-orange-200",
      dot: "bg-orange-500",
      label: "Warm",
    },
    hot: {
      bg: "bg-red-50",
      text: "text-red-700",
      ring: "ring-red-200",
      dot: "bg-red-500",
      label: "Hot",
    },
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      dot: "bg-emerald-500",
      label: "Active",
    },
    inactive: {
      bg: "bg-zinc-50",
      text: "text-zinc-700",
      ring: "ring-zinc-200",
      dot: "bg-zinc-400",
      label: "Inactive",
    },
  };
  const cfg = map[v] ?? {
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
    label: value || "—",
  };
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

/* ------------------------- chips ------------------------- */
function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700">
      {children}
      <button
        className="ml-1 hover:text-slate-900"
        onClick={onRemove}
        type="button"
      >
        ×
      </button>
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

/* ------------------------- filter dropdown (Status + State) ------------------------- */
function FilterDropdown({ open, onClose, value, onChange }) {
  if (!open) return null;

  // EXACT labels from your schema enum (order preserved)
  const statusesAll = [
    "Sampling",
    "New Prospect",
    "Uncategorized",
    "Closed lost",
    "Initial Contact",
    "Closed won",
    "Committed",
    "Consideration",
  ];

  // local input for adding states
  const stateInputRef = useRef(null);
  const addState = () => {
    const v = String(stateInputRef.current?.value || "").trim();
    if (!v) return;
    const key = v.toUpperCase(); // normalize states (CA, NY, SINDH, …)
    if (!value.states.includes(key)) {
      onChange({ ...value, states: [...value.states, key] });
    }
    if (stateInputRef.current) stateInputRef.current.value = "";
  };
  const removeState = (s) =>
    onChange({ ...value, states: value.states.filter((x) => x !== s) });

  return (
    <div
      className="absolute right-0 mt-2 w-[22rem] rounded-xl border border-slate-200 bg-white shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">Filters</div>
      </div>

      <div className="p-3 space-y-4">
        {/* Statuses (exact labels) */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Status
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {statusesAll.map((label) => (
              <NiceCheckbox
                key={label}
                label={label} // show as-is
                checked={value.statuses.includes(label)} // store as-is
                onChange={(ck) =>
                  onChange({
                    ...value,
                    statuses: ck
                      ? [...value.statuses, label]
                      : value.statuses.filter((x) => x !== label),
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* States */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            States
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={stateInputRef}
              type="text"
              placeholder="Add state (e.g., CA or Sindh)"
              className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addState();
                }
              }}
            />
            <button
              type="button"
              onClick={addState}
              className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-black"
            >
              Add
            </button>
          </div>
          {value.states.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {value.states.map((s) => (
                <Chip key={s} onRemove={() => removeState(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          )}
        </div>

        <div className="pt-1 flex items-center justify-between">
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={() => onChange({ statuses: [], states: [] })}
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

/* ------------------------- custom pagination (same as Users.jsx) ------------------------- */
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
  pageSize = 100,
  currentPage = 1,
  onChangePage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="text-sm text-slate-600">
        <span className="font-semibold">{start}</span>–
        <span className="font-semibold">{end}</span>
        <span className="mx-1">of</span>
        <span className="font-semibold">{total}</span>
      </div>
      <div className="flex items-center gap-2">
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
            <PgBtn onClick={() => onChangePage(totalPages)}>{totalPages}</PgBtn>
          </>
        )}
        <PgBtn
          disabled={currentPage >= totalPages}
          onClick={() => onChangePage(currentPage + 1)}
        >
          <FaArrowRight />
        </PgBtn>
      </div>
    </div>
  );
}

/* ------------------------- perf: memoized grid ------------------------- */
const ClientsGrid = React.memo(function ClientsGrid(props) {
  return <DataGrid {...props} />;
});

export default function Clients() {
  // search term (debounced)
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  // server-side pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });

  // filters
  const [filters, setFilters] = useState({ statuses: [], states: [] });
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

  // toolbar (add Filter button like Users.jsx)
  useToolbar({
    title: "Clients",
    searchPlaceholder: "Search clients (name, email, city, etc.)",
    onSearch: debouncedSearch,
    actions: [
      {
        label: "Filter",
        variant: "ghost",
        onClick: () => setFilterOpen((o) => !o),
      },
      { label: "+ Add", variant: "primary", to: "/clients/new" },
    ],
  });

  const pageForServer = paginationModel.page + 1;

  // NOTE: Update your hook to accept filters as 4th param like useUsers does:
  // function useClients(page, query, pageSize, filters)
  const { data, isLoading, isFetching, error } = useClients(
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  );

  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      {
        field: "contactStatus",
        headerName: "Status",
        width: 160,
        renderCell: (p) => <StatusBadge value={p.value} />,
        valueGetter: (v) => v,
        sortable: false,
      },
      { field: "city", headerName: "City", width: 130 },
      { field: "state", headerName: "State", width: 110 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
      { field: "phone", headerName: "Phone", width: 140 },
      { field: "website", headerName: "Website", flex: 1, minWidth: 180 },
      { field: "fullName", headerName: "Owner", width: 180 },
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
                  navigate(`/clients/${row._id}`);
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
    []
  );

  const handlePaginationChange = useCallback((model) => {
    setPaginationModel((prev) => {
      if (prev.page === model.page && prev.pageSize === model.pageSize)
        return prev;
      return { page: model.page, pageSize: model.pageSize };
    });
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load clients: {String(error.message)}
        </div>
      </div>
    );
  }

  const total = data?.meta?.total ?? 0;

  const handleRowClick = useCallback(
    (params) => {
      // MUI gives both params.id and params.row
      const id = params?.id ?? params?.row?._id;
      if (!id) return;
      navigate(`/client-details/${id}`);
    },
    [navigate]
  );

  return (
    <div className="relative shadow-sm overflow-hidden">
      {/* Filters panel (positioned relative to this container) */}
      <div className="fixed right-2 z-[999]">
        <FilterDropdown
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          value={filters}
          onChange={applyFilters}
        />
      </div>

      <div className="pt-0 pb-4 px-0">
        {isLoading && !data ? (
          <div className="flex items-center justify-center h-[60vh]">
            <ClipLoader size={42} />
          </div>
        ) : (
          <div className="min-h-[100vh]">
            <ClientsGrid
              columns={columns}
              rows={data?.rows ?? []}
              getRowId={(row) => row._id}
              loading={isFetching}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationChange}
              pageSizeOptions={[100]}
              paginationMode="server"
              rowCount={total}
              filterMode="server"
              rowHeight={44}
              rowBuffer={2}
              columnBuffer={2}
              disableColumnFilter
              disableColumnSelector
              hideFooterPagination
              hideFooterSelectedRowCount
              /** add this: */
              onRowClick={handleRowClick}
              sx={{
                border: "none",
                "& .MuiDataGrid-row": { cursor: "pointer" },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <div style={{ padding: 24, opacity: 0.6 }}>
                    No clients found
                  </div>
                ),
              }}
            />

            {/* Custom pagination bar */}
            <div className="px-2">
              <PaginationBar
                total={total}
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
          </div>
        )}
      </div>
    </div>
  );
}
