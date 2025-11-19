// src/components/activities/FilterDropdown.jsx
import React from "react";
import NiceCheckbox from "./NiceCheckbox";
import NiceRadio from "./NiceRadio";

/**
 * value: { types: string[] ('call','email'), datePreset: 'today'|'this_month'|'this_year'|'prev_year'|null }
 */
export default function FilterDropdown({ open, onClose, value, onChange }) {
  if (!open) return null;

  // toggle call/email
  const toggleType = (key, ck) => {
    const map = {
      call: "call",
      email: "email",
      texts: "texts",
      others: "others",
    };
    const val = map[key];
    const next = ck
      ? [...value.types, val]
      : value.types.filter((t) => t !== val);
    onChange({ ...value, types: next });
  };

  const setPreset = (p) => onChange({ ...value, datePreset: p });

  return (
    <div
      className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">Filters</div>
      </div>

      <div className="p-3 space-y-4">
        {/* Type */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Type
          </div>
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
            <NiceCheckbox
              label="Texts"
              checked={value.types.includes("texts")}
              onChange={(ck) => toggleType("texts", ck)}
            />
            <NiceCheckbox
              label="Others"
              checked={value.types.includes("others")}
              onChange={(ck) => toggleType("others", ck)}
            />
          </div>
        </div>

        {/* Date/Time presets */}
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Date/Time
          </div>
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

        {/* Footer buttons */}
        <div className="pt-2 flex items-center justify-between">
          <button
            className="text-sm text-slate-500 hover:text-slate-700"
            onClick={() => onChange({ types: [], datePreset: null })}
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
