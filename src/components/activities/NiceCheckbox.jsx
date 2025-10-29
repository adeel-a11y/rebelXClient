// src/components/activities/NiceCheckbox.jsx
import React from "react";
import { cls } from "./utils";

export default function NiceCheckbox({ label, checked, onChange }) {
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
