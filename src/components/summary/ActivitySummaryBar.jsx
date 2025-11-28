// src/components/ActivitiesSummaryBar.jsx
import React from "react";
import { useActivitiesSummary } from "../../hooks/useActivities";
import { useLocation } from "react-router-dom";

function Chip({ children, tone = "slate", subtle = false }) {
  const tones = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
    },
    rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
    },
    slate: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      ring: "ring-slate-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      ring: "ring-yellow-200",
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

export default function ActivitiesSummaryBar({ className = "" }) {
  const location = useLocation();
  const path = location?.pathname || "";
  const segments = path.split("/").filter(Boolean); // e.g. ["app","client-activities","CLI-123"]
  const lastSegment = segments[segments.length - 1];

  let externalId = "";
  let userId = "";

  if (path.includes("client-activities")) {
    externalId = lastSegment; // /client-activities/:externalId
  } else if (path.includes("user-activities")) {
    userId = lastSegment; // /user-activities/:userId
  }

  const { data, isLoading, error } = useActivitiesSummary({
    externalId,
    userId,
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

  const { calls, emails, texts, others, total } = data;

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
            <span className="ml-1 font-semibold">{calls}</span>
          </Chip>

          <Chip tone="rose">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              Emails
            </span>
            <span className="ml-1 font-semibold">{emails}</span>
          </Chip>
          <Chip tone="sky">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
              Texts
            </span>
            <span className="ml-1 font-semibold">{texts}</span>
          </Chip>
          <Chip tone="yellow">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
              Others
            </span>
            <span className="ml-1 font-semibold">{others}</span>
          </Chip>
        </div>
      </div>
    </div>
  );
}
