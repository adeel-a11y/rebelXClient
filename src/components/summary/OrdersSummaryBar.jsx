// src/components/OrdersSummaryBar.jsx
import React, { useMemo } from "react";
import { useOrdersSummary } from "../../hooks/useOrders";
import { useLocation } from "react-router-dom";

/* ---------------------- styling (order statuses) ---------------------- */
const STATUS_STYLES = {
  Completed: "ring-emerald-200 hover:ring-emerald-300",
  Issued: "ring-sky-200 hover:ring-sky-300",
  "Pending Payment": "ring-amber-200 hover:ring-amber-300",
  Shipping: "ring-indigo-200 hover:ring-indigo-300",
  Cancelled: "ring-rose-200 hover:ring-rose-300",
  Confirmed: "ring-cyan-200 hover:ring-cyan-300",
  Delivered: "ring-teal-200 hover:ring-teal-300",
  Pending: "ring-slate-200 hover:ring-slate-300",
  Processing: "ring-violet-200 hover:ring-violet-300",
  Returned: "ring-zinc-200 hover:ring-zinc-300",
  Other: "ring-zinc-200 hover:ring-zinc-300",
};

const DOT_STYLES = {
  Completed: "bg-emerald-500",
  Issued: "bg-sky-500",
  "Pending Payment": "bg-amber-500",
  Shipping: "bg-indigo-500",
  Cancelled: "bg-rose-500",
  Confirmed: "bg-cyan-500",
  Delivered: "bg-teal-500",
  Pending: "bg-slate-400",
  Processing: "bg-violet-500",
  Returned: "bg-zinc-500",
  Other: "bg-zinc-500",
};

/* ----------------------------- component ----------------------------- */
export default function OrdersSummaryBar({ className = "" }) {
  const location = useLocation();
  const externalId = location?.pathname?.slice(15) ?? '';

  console.log("externalId", externalId);

  const { data, isLoading, error } = useOrdersSummary(externalId);

  // ---- shape: { success: true, data: [{ OrderStatus, count }, ...] }
  const { total, items } = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data?.data : [];
    const total = rows.reduce((acc, r) => acc + (r?.count || 0), 0);
    const items = rows
      .map((r) => ({
        status: r?.OrderStatus || "Other",
        count: r?.count || 0,
      }))
      .sort((a, b) => b.count - a.count) // big first
      .map((x) => ({
        ...x,
        pct: total ? Math.round((x.count / total) * 100) : 0,
      }));
    return { total, items };
  }, [data]);

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
        Failed to load summary
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="w-full px-3 py-3 text-sm text-slate-500">
        Loading summary…
      </div>
    );
  }

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="flex flex-row items-center justify-between gap-3 px-3 py-2">
        {/* LEFT: total */}
        <div className="text-sm text-slate-600">
          <span className="font-semibold">Total Orders:</span> {total}
        </div>

        {/* RIGHT: chips */}
        <div className="flex gap-2 w-full">
          {items.map((x) => (
            <button
              key={x.status}
              className={[
                "group inline-flex w-full items-center justify-between",
                "rounded-full ring-1 bg-white px-3 py-1.5 text-xs",
                "shadow-sm hover:shadow transition-shadow",
                STATUS_STYLES[x.status] || STATUS_STYLES.Other,
              ].join(" ")}
              title={`${x.status} · ${x.count} (${x.pct}%)`}
              type="button"
            >
              <span className="flex items-center gap-2 text-slate-700">
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    DOT_STYLES[x.status] || DOT_STYLES.Other,
                  ].join(" ")}
                />
                <span className="text-xs font-medium">{x.status}</span>
              </span>

              <span className="inline-flex items-center gap-1 ps-4">
                <span className="inline-flex items-center justify-center min-w-[1.6rem] h-6 rounded-full bg-slate-100 text-slate-800">
                  {x.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
