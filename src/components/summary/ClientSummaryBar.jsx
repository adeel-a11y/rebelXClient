const STATUS_STYLES = {
  Sampling: "ring-sky-200 hover:ring-sky-300",
  "New Prospect": "ring-amber-200 hover:ring-amber-300",
  Uncategorized: "ring-slate-200 hover:ring-slate-300",
  "Closed lost": "ring-rose-200 hover:ring-rose-300",
  "Initial Contact": "ring-cyan-200 hover:ring-cyan-300",
  "Closed won": "ring-emerald-200 hover:ring-emerald-300",
  Committed: "ring-indigo-200 hover:ring-indigo-300",
  Consideration: "ring-violet-200 hover:ring-violet-300",
  Other: "ring-zinc-200 hover:ring-zinc-300",
};

const DOT_STYLES = {
  Sampling: "bg-sky-400",
  "New Prospect": "bg-amber-400",
  Uncategorized: "bg-slate-400",
  "Closed lost": "bg-rose-500",
  "Initial Contact": "bg-cyan-400",
  "Closed won": "bg-emerald-500",
  Committed: "bg-indigo-500",
  Consideration: "bg-violet-500",
  Other: "bg-zinc-500",
};

export default function ClientSummaryBar({ data, loading }) {
  if (loading) {
    return (
      <div className="w-full px-3 py-3 text-sm text-slate-500">
        Loading summary…
      </div>
    );
  }

  const total = data?.total ?? 0;
  const items = data?.byStatus ?? [];

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between gap-3 px-3 py-2">
        {/* LEFT: total + timestamp */}
        <div className="text-sm text-slate-600">
          <span className="font-semibold">Total Clients:</span> {total}
        </div>

        {/* RIGHT: chips (wrap) */}
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
              title={`${x.status} · ${x.count} (${x.pct ?? 0}%)`}
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

              <span className="inline-flex items-center gap-1">
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
