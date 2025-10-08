// src/components/ActivitiesSummaryBar.jsx
import React from "react";
import { useActivitiesSummary } from "../../hooks/useActivities";

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

export default function ActivitiesSummaryBar({
  className = "",
  q = "",
  datePreset = null,
  from,
  to,
}) {
  const { data, isLoading, error } = useActivitiesSummary({
    q,
    datePreset,
    from,
    to,
  });

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
        Failed to load summary
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-7 w-24 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  const { totalCalls, totalEmails, total } = data;

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Chip tone="slate">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
            Total
          </span>
          <span className="ml-1 font-semibold">{total}</span>
        </Chip>
        <div className="flex items-center gap-4">
          <Chip tone="emerald">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Calls
            </span>
            <span className="ml-1 font-semibold">{totalCalls}</span>
          </Chip>

          <Chip tone="rose">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              Emails
            </span>
            <span className="ml-1 font-semibold">{totalEmails}</span>
          </Chip>
        </div>
      </div>
    </div>
  );
}
