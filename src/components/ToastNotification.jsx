import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const VARIANTS = {
  success: {
    Icon: FiCheckCircle,
    pill: "from-emerald-500/90 to-emerald-600/90",
    ring: "ring-emerald-500/40",
  },
  error: {
    Icon: FiAlertTriangle,
    pill: "from-rose-500/90 to-rose-600/90",
    ring: "ring-rose-500/40",
  },
  info: {
    Icon: FiInfo,
    pill: "from-sky-500/90 to-indigo-600/90",
    ring: "ring-sky-500/40",
  },
};

export default function ToastNotification({
  open,
  type = "success", // "success" | "error" | "info"
  title,
  message,
  duration = 4000,
  onClose,
}) {
  const variant = VARIANTS[type] ?? VARIANTS.success;
  const { Icon, pill, ring } = variant;

  useEffect(() => {
    if (!open || !duration) return;
    const id = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  const node = (
    <div className="fixed bottom-8 left-1/2 z-[9999] pointer-events-none flex flex-col gap-2">
      <div
        className={`pointer-events-auto max-w-sm rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-100 ${ring} p-4 flex gap-3 items-start`}
      >
        {/* Colored pill + icon */}
        <div
          className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${pill} shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {message && (
            <p className="mt-1 text-xs leading-snug text-slate-600">
              {message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="ml-2 mt-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
