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
import {
  useClients,
  useDeleteClient,
  useUpdateClient,
  useUpdateStatusClient,
} from "../hooks/useClients";
import { useToolbar } from "../store/toolbar";
import { FiEdit2, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useUserNames } from "../hooks/useUsers";

/* ------------------------- constants ------------------------- */
const STATUS_OPTIONS = [
  "Sampling",
  "New Prospect",
  "Uncategorized",
  "Closed lost",
  "Initial Contact",
  "Closed won",
  "Committed",
  "Consideration",
];

/* ------------------------- helpers ------------------------- */
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

/* ------------------------- status badge ------------------------- */
function StatusBadge({ value }) {
  const canon = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
  const map = {
    sampling: {
      bg: "bg-sky-50",
      ring: "ring-sky-200",
      text: "text-sky-700",
      dot: "bg-sky-500",
      gradient: "from-sky-50 via-sky-50 to-white",
      label: "Sampling",
    },
    "new prospect": {
      bg: "bg-indigo-50",
      ring: "ring-indigo-200",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
      gradient: "from-indigo-50 via-indigo-50 to-white",
      label: "New Prospect",
    },
    uncategorized: {
      bg: "bg-yellow-50",
      ring: "ring-yellow-200",
      text: "text-yellow-700",
      dot: "bg-yellow-400",
      gradient: "from-yellow-50 via-yellow-50 to-white",
      label: "Uncategorized",
    },
    "closed lost": {
      bg: "bg-rose-50",
      ring: "ring-rose-200",
      text: "text-rose-700",
      dot: "bg-rose-500",
      gradient: "from-rose-50 via-rose-50 to-white",
      label: "Closed lost",
    },
    "initial contact": {
      bg: "bg-cyan-50",
      ring: "ring-cyan-200",
      text: "text-cyan-700",
      dot: "bg-cyan-500",
      gradient: "from-cyan-50 via-cyan-50 to-white",
      label: "Initial Contact",
    },
    "closed won": {
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      gradient: "from-emerald-50 via-emerald-50 to-white",
      label: "Closed won",
    },
    committed: {
      bg: "bg-violet-50",
      ring: "ring-violet-200",
      text: "text-violet-700",
      dot: "bg-violet-500",
      gradient: "from-violet-50 via-violet-50 to-white",
      label: "Committed",
    },
    consideration: {
      bg: "bg-amber-50",
      ring: "ring-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      gradient: "from-amber-50 via-amber-50 to-white",
      label: "Consideration",
    },
  };
  const cfg = map[canon] ?? {
    bg: "bg-zinc-50",
    ring: "ring-zinc-200",
    text: "text-zinc-700",
    dot: "bg-zinc-400",
    gradient: "from-zinc-50 via-zinc-50 to-white",
    label: value || "—",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        "ring-1",
        cfg.ring,
        cfg.bg,
        cfg.text,
        "bg-gradient-to-r",
        cfg.gradient,
        "shadow-[0_1px_0_rgba(2,6,23,0.04)]",
      ].join(" ")}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ------------------------- Status cell: badge + 3-dot dropdown ------------------------- */
function StatusCell({ row }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const { mutate: updateStatus, isPending } = useUpdateStatusClient(row._id);

  // place menu relative to button (viewport / scroll safe)
  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 8, // 8px gap
      left: Math.max(8, Math.min(window.innerWidth - 200, r.left)), // keep in viewport
      width: r.width,
    });
  }, []);

  // open → compute position + listeners
  useEffect(() => {
    if (!open) return;
    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, place]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown, true);
    return () => document.removeEventListener("mousedown", onDocDown, true);
  }, [open]);

  const pick = (label) => {
    updateStatus({ contactStatus: label }, { onSettled: () => setOpen(false) });
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <StatusBadge value={row.contactStatus} />

      <button
        ref={btnRef}
        type="button"
        className="p-1 rounded hover:bg-slate-100"
        title="Change status"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} // stop grid focus
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {isPending ? (
          <ClipLoader size={14} />
        ) : (
          <FiMoreVertical size={16} className="text-slate-600" />
        )}
      </button>

      {/* PORTAL MENU: renders to body so it won't be clipped by DataGrid */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 2000,
            }}
            className="w-56 rounded-lg border border-slate-200 bg-white shadow-lg py-1"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                className={cls(
                  "w-full text-left px-3 py-2 text-sm hover:bg-slate-50",
                  label === row.contactStatus && "bg-slate-50"
                )}
                onClick={() => pick(label)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

/* ------------------------- Client cell: user name + 3-dot dropdown ------------------------- */
function UserDropdownCell({
  row,
  fieldKey = "fullName",
  title = "Change user",
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const { data: users, isLoading } = useUserNames(); // <- list users
  const { mutate: updateClient, isPending } = useUpdateClient(row._id); // <- update

  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 8,
      left: Math.max(8, Math.min(window.innerWidth - 240, r.left)),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    place();
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown, true);
    return () => document.removeEventListener("mousedown", onDocDown, true);
  }, [open]);

  const current = row?.[fieldKey] || "—";

  const pick = (u) => {
    // Send fullName; your backend will map it to ownedBy email and update
    updateClient({ fullName: u }, { onSettled: () => setOpen(false) });
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <span className="truncate max-w-[160px]">{current}</span>

      <button
        ref={btnRef}
        type="button"
        className="p-1 rounded hover:bg-slate-100"
        title={"Change user"}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} // stop grid focus
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {isPending ? (
          <ClipLoader size={14} />
        ) : (
          <FiMoreVertical size={16} className="text-slate-600" />
        )}
      </button>
      {/* <button
        ref={btnRef}
        type="button"
        className="px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
        title={title}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        disabled={isPending}
      >
        {isPending ? "…" : "Change"}
      </button> */}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 2000,
            }}
            className="w-60 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg p-1"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2 py-1 text-xs text-slate-500">{title}</div>
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-slate-500">Loading…</div>
            ) : (
              users.map((u) => (
                <button
                  key={u}
                  type="button"
                  className={cls(
                    "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-50",
                    u.name === current && "bg-slate-50"
                  )}
                  onClick={() => pick(u)}
                  disabled={isPending}
                >
                  <div className="font-medium">{u}</div>
                </button>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
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

  const stateInputRef = useRef(null);
  const addState = () => {
    const v = String(stateInputRef.current?.value || "").trim();
    if (!v) return;
    const key = v.toUpperCase();
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
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Status
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {STATUS_OPTIONS.map((label) => (
              <NiceCheckbox
                key={label}
                label={label}
                checked={value.statuses.includes(label)}
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
  pageSize = 100,
  currentPage = 1,
  onChangePage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 w-[650px] mx-auto rounded-[25px] bg-white/95 backdrop-blur-[1px] px-2 border-t border-slate-200 shadow-[0_-4px_12px_rgba(2,6,23,0.04)]">
      <div className="h-12 grid grid-cols-3 items-center gap-2 px-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{start}</span>–
          <span className="font-semibold">{end}</span>
          <span className="mx-1">of</span>
          <span className="font-semibold">{total}</span>
        </div>

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

        <div className="text-right text-sm text-slate-700">
          Page: <span className="font-semibold">{currentPage}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- perf: memoized grid ------------------------- */
const ClientsGrid = React.memo(function ClientsGrid(props) {
  return <DataGrid {...props} />;
});

export default function Clients() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const [filters, setFilters] = useState({ statuses: [], states: [] });
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

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
    backButton: true,
  });

  const pageForServer = paginationModel.page + 1;

  const { data, isLoading, isFetching, error } = useClients(
    pageForServer,
    query,
    paginationModel.pageSize,
    filters
  );

  // DELETE
  const { mutateAsync: deleteClient, isPending: deleting } = useDeleteClient();
  const [confirm, setConfirm] = useState({
    open: false,
    row: null,
    error: "",
    nonce: null,
  });
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
      await deleteClient(confirm.row._id);
    } finally {
      closeConfirm();
    }
  };

  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Client Name",
      flex: 1,
      minWidth: 180,
      renderCell: (p) => <div>{p.value || "—"}</div>,
    },

    // Use unique field keys + valueGetter to read the same row.fullName
    {
      field: "fullName",
      headerName: "Created By",
      width: 220,
      renderCell: (p) => (
        <UserDropdownCell
          row={p.row}
          fieldKey="fullName"
          title="Change Created By"
        />
      ),
    },

    // Current Sales Rep -> if you also want to drive from fullName, reuse the same.
    // If later you add a dedicated field (e.g., currentSalesRepName), just change fieldKey.
    {
      field: "currentSalesRep",
      headerName: "Current Sales Rep",
      width: 240,
      renderCell: (p) => (
        <UserDropdownCell
          row={p.row}
          fieldKey="fullName"
          title="Change Sales Rep"
        />
      ),
    },
    {
      field: "soldBy", // unique
      headerName: "Sold By",
      flex: 1,
      minWidth: 180,
      renderCell: (p) => <div>{p?.row?.fullName || "—"}</div>,
    },

    {
      field: "state",
      headerName: "State",
      width: 110,
      renderCell: (p) => <div>{p.value || "—"}</div>,
    },

    {
      field: "contactStatus",
      headerName: "Status",
      width: 220,
      sortable: false,
      renderCell: (p) => <StatusCell row={p.row} />,
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
  ];

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
      const id = params?.id ?? params?.row?._id;
      if (!id) return;
      navigate(`/client-details/${id}`);
    },
    [navigate]
  );

  return (
    <div className="relative shadow-sm overflow-hidden">
      <ConfirmDialog
        open={confirm.open}
        title="Delete client?"
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
          <div className="h-[calc(100vh-90px)] overflow-auto relative pb-12">
            <ClientsGrid
              autoHeight
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
        )}
      </div>
    </div>
  );
}
