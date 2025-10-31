// src/components/orders/OrderFilterDropdown.jsx
import React from "react";
import NiceCheckbox from "../activities/NiceCheckbox";
import NiceRadio from "../activities/NiceRadio";

const ALL_STATUSES = [
  "pending",
  "pending payment",
  "confirmed",
  "processing",
  "shipping",
  "delivered",
  "completed",
  "issued",
  "cancelled",
  "returned",
];

export default function OrderFilterDropdown({ open, onClose, value, onChange }) {
  if (!open) return null;

  const toggleStatus = (status, checked) => {
    const next = checked
      ? [...new Set([...(value.statuses || []), status])]
      : (value.statuses || []).filter((s) => s !== status);
    onChange({ ...value, statuses: next });
  };

  const setPreset = (p) => onChange({ ...value, datePreset: p });

  return (
    <div
      className="absolute right-0 mt-2 w-[28rem] rounded-xl border border-slate-200 bg-white shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">Filters</div>
      </div>

      <div className="p-3 space-y-4">
        {/* Status */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Status
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((s) => (
              <NiceCheckbox
                key={s}
                label={s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                checked={(value.statuses || []).includes(s)}
                onChange={(ck) => toggleStatus(s, ck)}
              />
            ))}
          </div>
        </div>

        {/* Date presets */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Date/Time
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NiceRadio
              name="order_datepreset"
              label="Today"
              checked={value.datePreset === "today"}
              onChange={() => setPreset("today")}
            />
            <NiceRadio
              name="order_datepreset"
              label="This Month"
              checked={value.datePreset === "this_month"}
              onChange={() => setPreset("this_month")}
            />
            <NiceRadio
              name="order_datepreset"
              label="This Year"
              checked={value.datePreset === "this_year"}
              onChange={() => setPreset("this_year")}
            />
            <NiceRadio
              name="order_datepreset"
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

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={() => onChange({ statuses: [], datePreset: null })}
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
