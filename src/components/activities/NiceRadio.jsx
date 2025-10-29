// src/components/activities/NiceRadio.jsx
import React from "react";
import { cls } from "./utils";

export default function NiceRadio({
  name,
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        name={name}
        className="peer sr-only"
        checked={checked}
        onChange={() => onChange()}
      />
      <span
        className={cls(
          "h-4 w-4 rounded-full border ring-1 flex items-center justify-center",
          checked
            ? "bg-slate-900 border-slate-900 ring-slate-900"
            : "bg-white border-slate-300 ring-slate-200"
        )}
      >
        <span
          className={cls(
            "h-2 w-2 rounded-full",
            checked ? "bg-white" : "bg-transparent"
          )}
        />
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
