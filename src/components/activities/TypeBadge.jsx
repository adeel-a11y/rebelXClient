// src/components/activities/TypeBadge.jsx
import React from "react";
import { cls } from "./utils";

export default function TypeBadge({ value }) {
  // normalize API values -> friendly & color
  const raw = String(value || "").toLowerCase();
  const isCall =
    raw === "call_made" ||
    raw === "call" ||
    raw === "phone" ||
    raw === "phone_call";
  const isEmail = raw === "email_sent" || raw === "email";

  const map = isCall
    ? {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        ring: "ring-emerald-200",
        dot: "bg-emerald-500",
        label: "Call",
      }
    : isEmail
    ? {
        bg: "bg-red-50",
        text: "text-red-600",
        ring: "ring-red-200",
        dot: "bg-red-500",
        label: "Email",
      }
    : raw === "text"
    ? {
        bg: "bg-blue-50",
        text: "text-blue-600",
        ring: "ring-blue-200",
        dot: "bg-blue-500",
        label: "Text",
      }
    : raw === "meeting_scheduled"
    ? {
        bg: "bg-pink-50",
        text: "text-pink-600",
        ring: "ring-pink-200",
        dot: "bg-pink-500",
        label: "Meeting",
      }
    : {
        bg: "bg-slate-50",
        text: "text-slate-700",
        ring: "ring-slate-200",
        dot: "bg-slate-400",
        label: value || "—",
      };

  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1",
        map.ring,
        map.bg,
        map.text
      )}
    >
      <span
        className={cls(
          "inline-block h-1.5 w-1.5 rounded-full",
          map.dot
        )}
      />
      {map.label}
    </span>
  );
}
