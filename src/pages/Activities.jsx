// src/pages/Activities.jsx
import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ClipLoader } from "react-spinners";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToolbar } from "../store/toolbar";
import {
  useActivities,          // GET (server-side pagination + filters)
  useDeleteActivity,      // DELETE
} from "../hooks/useActivities";

/* ------------------------- helpers ------------------------- */
const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);
const cls = (...xs) => xs.filter(Boolean).join(" ");

// debounce (no lodash)
function useDebouncedCallback(callback, delay) {
  const cbRef = useRef(callback);
  useEffect(() => { cbRef.current = callback; }, [callback]);
  const timerRef = useRef(null);
  return useMemo(
    () => (value) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => cbRef.current(value), delay);
    },
    [delay]
  );
}

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash(v) : d.toLocaleString();
};

/* ------------------------- confirm dialog ------------------------- */
function ConfirmDialog({ open, title, desc, confirmText = "Delete", onCancel, onConfirm, busy }) {
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
            className={cls(
              "px-3 py-1.5 rounded-md text-white",
              busy ? "bg-rose-300" : "bg-rose-600 hover:bg-rose-700"
            )}
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
function TypeBadge({ value }) {

  // normalize API values -> friendly & color
  const raw = String(value || "").toLowerCase();
  console.log("raw", raw)
  const isCall = raw === "call_made" || raw === "call" || raw === "phone" || raw === "phone_call";
  const isEmail = raw === "email_sent" || raw === "email";
  const map = isCall
    ? { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500", label: "Call" }
    : isEmail
    ? { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-200", dot: "bg-red-500", label: "Email" }
    : raw === "text"
    ? { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200", dot: "bg-blue-500", label: "Text" }
    : raw === "meeting_scheduled"
    ? { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-200", dot: "bg-pink-500", label: "Meeting" }
    : { bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200", dot: "bg-slate-400", label: value || "—" };

  return (
    <span className={cls(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1",
      map.ring, map.bg, map.text
    )}>
      <span className={cls("inline-block h-1.5 w-1.5 rounded-full", map.dot)} />
      {map.label}
    </span>
  );
}

/* ------------------------- pretty checkbox + radio ------------------------- */
function NiceCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cls(
        "h-4 w-4 rounded border ring-1 flex items-center justify-center",
        checked ? "bg-slate-900 border-slate-900 ring-slate-900" : "bg-white border-slate-300 ring-slate-200"
      )}>
        <svg viewBox="0 0 24 24" className={cls("h-3 w-3", checked ? "text-white opacity-100" : "opacity-0")}
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
function NiceRadio({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="radio" name={name} className="peer sr-only" checked={checked} onChange={() => onChange()} />
      <span className={cls(
        "h-4 w-4 rounded-full border ring-1 flex items-center justify-center",
        checked ? "bg-slate-900 border-slate-900 ring-slate-900" : "bg-white border-slate-300 ring-slate-200"
      )}>
        <span className={cls("h-2 w-2 rounded-full", checked ? "bg-white" : "bg-transparent")} />
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

/* ------------------------- filter dropdown ------------------------- */
function FilterDropdown({ open, onClose, value, onChange }) {
  // value: { types: string[] ('call','email'), datePreset: 'today'|'this_month'|'this_year'|'prev_year'|null }
  if (!open) return null;
  const toggleType = (key, ck) => {
    const map = { call: "call", email: "email" };
    const val = map[key];
    const next = ck ? [...value.types, val] : value.types.filter((t) => t !== val);
    onChange({ ...value, types: next });
  };
  const setPreset = (p) => onChange({ ...value, datePreset: p });

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50"
         onClick={(e) => e.stopPropagation()}>
      <div className="p-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">Filters</div>
      </div>
      <div className="p-3 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Type</div>
          <div className="flex items-center gap-4">
            <NiceCheckbox
              label="Call"
              checked={value.types.includes("call")}
              onChange={(ck) => toggleType("call", ck)}
            />
            <NiceCheckbox
              label="Email"
              checked={value.types.includes("email")}
              onChange={(ck) => toggleType("email", ck)}
            />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Date/Time</div>
          <div className="grid grid-cols-2 gap-2">
            <NiceRadio
              name="datepreset"
              label="Today"
              checked={value.datePreset === "today"}
              onChange={() => setPreset("today")}
            />
            <NiceRadio
              name="datepreset"
              label="This Month"
              checked={value.datePreset === "this_month"}
              onChange={() => setPreset("this_month")}
            />
            <NiceRadio
              name="datepreset"
              label="This Year"
              checked={value.datePreset === "this_year"}
              onChange={() => setPreset("this_year")}
            />
            <NiceRadio
              name="datepreset"
              label="Previous Year"
              checked={value.datePreset === "prev_year"}
              onChange={() => setPreset("prev_year")}
            />
            <button
              className="text-left text-sm text-slate-500 hover:text-slate-700 mt-1"
              onClick={() => setPreset(null)}
              type="button"
            >
              Clear date filter
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button className="text-sm text-slate-500 hover:text-slate-700" onClick={() => onChange({ types: [], datePreset: null })}>
            Clear all
          </button>
          <button className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-black" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- custom pagination ------------------------- */
function PgBtn({ active, disabled, children, onClick }) {
  const base = "inline-flex items-center justify-center h-8 min-w-[2rem] rounded-full border text-sm transition";
  const classes = disabled
    ? "cursor-not-allowed opacity-50 bg-white border-slate-200 text-slate-400"
    : active
    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
  return (
    <button className={`${base} ${classes} px-2`} onClick={onClick} disabled={disabled} type="button">
      {children}
    </button>
  );
}
function makePageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5];
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
  return [current - 2, current - 1, current + 1, current + 2];
}
function PaginationBar({ total = 0, pageSize = 20, currentPage = 1, onChangePage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = makePageList(currentPage, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 w-[70vh] mx-auto bg-white/95 backdrop-blur-[1px] border-t border-slate-200 rounded-[20px] shadow-[0_-4px_12px_rgba(2,6,23,0.04)]">
      <div className="h-12 grid grid-cols-3 items-center gap-2 px-3">
        <div className="text-sm text-slate-600">
          <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span>
          <span className="mx-1">of</span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <PgBtn disabled={currentPage <= 1} onClick={() => onChangePage(currentPage - 1)}><FaArrowLeft /></PgBtn>

          {pages[0] > 1 && (
            <>
              <PgBtn onClick={() => onChangePage(1)}>1</PgBtn>
              {pages[0] > 2 && <span className="px-1 text-slate-400">…</span>}
            </>
          )}

          {pages.map((p) => (
            <PgBtn key={p} active={p === currentPage} onClick={() => onChangePage(p)}>{p}</PgBtn>
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
              <PgBtn onClick={() => onChangePage(totalPages)}>{totalPages}</PgBtn>
            </>
          )}

          <PgBtn disabled={currentPage >= totalPages} onClick={() => onChangePage(currentPage + 1)}><FaArrowRight /></PgBtn>
        </div>
        <div className="text-right text-sm text-slate-700">
          Page: <span className="font-semibold">{currentPage}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- page ------------------------- */
export default function Activities() {
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
  const pageForServer = paginationModel.page + 1;

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ types: [], datePreset: null }); // types: ['call','email']
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((val) => {
    const v = String(val || "").trim();
    setQuery(v);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, 250);

  useToolbar({
    title: "Activities",
    searchPlaceholder: "Search activities…",
    onSearch: debouncedSearch,
    actions: [
      { label: "Filter", variant: "ghost", onClick: () => setFilterOpen((o) => !o) },
      { label: "+ Add", variant: "primary", to: "/activities/new" },
    ],
  });

  const { data, isLoading, isFetching } = useActivities(pageForServer, query, paginationModel.pageSize, filters);

  // DELETE mutation + confirm
  const { mutateAsync: deleteMutate, isLoading: deleting } = useDeleteActivity();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const openConfirm = (row) => { setTarget(row); setConfirmOpen(true); };
  const closeConfirm = () => { setConfirmOpen(false); setTarget(null); };
  const handleConfirmDelete = async () => {
    if (!target?._id) return;
    try {
      await deleteMutate(target._id);
      closeConfirm();
      setPaginationModel((m) => ({ ...m })); // trigger refetch
    } catch (e) {
      console.error("Delete failed:", e?.message || e);
      closeConfirm();
    }
  };

  const applyFilters = useCallback((next) => {
    setFilters(next);
    setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 }));
  }, []);

  // columns
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
      { field: "clientId", headerName: "Client", width: 160, valueFormatter: (v) => dash(v) },
      { field: "userId", headerName: "User", width: 220, valueFormatter: (v) => dash(v) },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 260,
        valueFormatter: (v) => dash(v),
      },
      { field: "createdAt", headerName: "Date", width: 220, valueFormatter: (v) => dash(v) },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const row = params.row;
          const stop = (e) => { e.stopPropagation(); e.preventDefault(); };
          return (
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-slate-100"
                title="Edit"
                onClick={(e) => { stop(e); navigate(`/activities/${row._id}`); }}
              >
                <FiEdit2 size={16} />
              </button>
              <button
                className="p-1 rounded hover:bg-red-50"
                title="Delete"
                onClick={(e) => { stop(e); openConfirm(row); }}
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
      <div className="relative">
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
                  : { page: model.page, pageSize: 100 }
              )
            }
            pageSizeOptions={[100]}
            paginationMode="server"
            rowCount={data?.meta?.total ?? 0}
            filterMode="server"
            hideFooterPagination
            hideFooterSelectedRowCount
            onRowClick={(params) => navigate(`/activity-details/${params.id}`)}
            sx={{
              border: "none",
              "& .MuiDataGrid-row": { cursor: "pointer" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
            }}
          />
          <PaginationBar
            total={data?.meta?.total ?? 0}
            pageSize={paginationModel.pageSize}
            currentPage={(paginationModel.page ?? 0) + 1}
            onChangePage={(newPage1) =>
              setPaginationModel((prev) => ({ ...prev, page: Math.max(0, newPage1 - 1) }))
            }
          />
        </div>
      )}

      {/* confirm modal */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete activity?"
        desc={`Are you sure you want to delete activity "${target?.description || target?._id || ""}"? This action cannot be undone.`}
        confirmText="Delete"
        onCancel={closeConfirm}
        onConfirm={handleConfirmDelete}
        busy={deleting}
      />
    </div>
  );
}
