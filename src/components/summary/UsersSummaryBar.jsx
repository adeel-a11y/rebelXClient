// ---- src/components/UsersSummaryBar.jsx ----
import React from "react";
import { FiUsers } from "react-icons/fi";
import { useUsersSummary } from "../../hooks/useUsers";

function Chip({ children, tone = "slate", subtle = false }) {
  const tones = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
    },
    rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
    },
    sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      ring: "ring-amber-200",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
    },
    slate: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      ring: "ring-slate-200",
    },
  };
  const c = tones[tone] ?? tones.slate;
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full ring-1 px-3 py-1",
        "text-xs md:text-[13px] font-medium",
        subtle ? "opacity-95" : "",
        c.bg,
        c.text,
        c.ring,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function roleTone(role) {
  const r = String(role || "").toLowerCase();
  if (r === "admin") return "rose";
  if (r === "manager") return "indigo";
  if (r === "employee") return "sky";
  if (r.includes("sales")) return "amber";
  if (r.includes("warehouse")) return "violet";
  if (r.includes("shipping")) return "emerald";
  if (r.includes("qc")) return "indigo";
  return "slate";
}

export default function UsersSummaryBar({ className = "" }) {
  const { data, isLoading, error } = useUsersSummary();

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
        Failed to load summary
      </div>
    );
  }

  // skeleton
  if (isLoading || !data) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4">
        <div className="animate-pulse flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="h-4 w-40 rounded bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { total, active, inactive, byRole } = data;

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="flex flex-row items-center justify-between gap-3">
        {/* LEFT: total */}

        {/* <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiUsers className="text-slate-600" />
          </div> */}
        <div className="text-sm text-slate-600">
          <span className="font-semibold">Total Users:</span> {total}
        </div>

        {/* RIGHT: status chips + role chips */}
        <div className="flex gap-2 w-full md:w-auto">
          {/* status */}
          <Chip tone="emerald">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </span>
            <span className="ml-1 font-semibold">{active}</span>
          </Chip>

          <Chip tone="slate">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
              Inactive
            </span>
            <span className="ml-1 font-semibold">{inactive}</span>
          </Chip>

          {/* roles */}
          {byRole?.map((r) => (
            <Chip key={r.role} tone={roleTone(r.role)} subtle>
              <span className="capitalize">{r.role.replace(/-/g, " ")}</span>
              <span className="ml-1 font-semibold">{r.total}</span>
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
