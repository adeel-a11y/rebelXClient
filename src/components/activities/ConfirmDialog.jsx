// src/components/activities/ConfirmDialog.jsx
import React from "react";
import { cls } from "./utils";

export default function ConfirmDialog({
  open,
  title,
  desc,
  confirmText = "Delete",
  onCancel,
  onConfirm,
  busy,
}) {
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
