// src/pages/ActivityUpsert.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useToolbar } from "../../store/toolbar";
import {
  useActivity,
  useCreateActivity,
  useUpdateActivity,
} from "../../hooks/useActivities";
import { useClientNames, useUserNames } from "../../hooks/useLookups";

const TYPES = [
  "created",
  "status_changed",
  "note_added",
  "email_sent",
  "call_made",
  "meeting_scheduled",
];

const initial = {
  clientId: "",     // here: client NAME (per your request)
  userId: "",       // here: user NAME (per your request)
  trackingId: "",
  type: "call_made",
  description: "",
  createdAt: "",    // blank => backend default now()
};

function Field({ label, required, children }) {
  return (
    <div className="col-span-1">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ActivityUpsert() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);


  // load for edit
  const { data: existing, isLoading: loadingExisting, error: loadErr } = useActivity(id, isEdit);
  const { mutateAsync: createMutate, isPending: creating } = useCreateActivity();
  const { mutateAsync: updateMutate, isPending: updating } = useUpdateActivity();

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useToolbar({
    title: isEdit ? "Edit Activity" : "Add Activity",
    searchPlaceholder: "",
    actions: [{ label: "Cancel", variant: "ghost", onClick: () => navigate("/activities") }],
    backButton: true,
  });

  // Lookups (simple “load-all” mode; if list is huge, wire q to an input)
  const { data: clientNames = [], isLoading: loadingClients } = useClientNames("", 1000, true);
  const { data: userNames = [], isLoading: loadingUsers } = useUserNames("", 1000, true);

  // hydrate when editing
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        clientId: existing.clientId ?? "",
        userId: existing.userId ?? "",
        trackingId: existing.trackingId ?? "",
        type: existing.type ?? "call_made",
        description: existing.description ?? "",
        createdAt: existing.createdAt ? toInputDateTime(existing.createdAt) : "",
      });
    }
  }, [isEdit, existing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = useMemo(() => {
    if (!form.clientId?.trim()) return false;
    if (!form.userId?.trim()) return false;
    if (!form.trackingId?.trim()) return false;
    if (!TYPES.includes(form.type)) return false;
    if (!form.description?.trim()) return false;
    return true;
  }, [form]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!canSubmit) {
      setError("Please fix the highlighted fields.");
      return;
    }
    try {
      const payload = {
        clientId: form.clientId.trim(),   // per your request: using NAME string
        userId: form.userId.trim(),       // per your request: using NAME string
        trackingId: form.trackingId.trim(),
        type: form.type,
        description: form.description.trim(),
        ...(form.createdAt ? { createdAt: new Date(form.createdAt).toISOString() } : {}),
      };

      if (isEdit) {
        await updateMutate({ id, payload });
      } else {
        await createMutate(payload);
      }
      navigate("/activities");
    } catch (err) {
      setError(err?.message || "Failed to save activity.");
    }
  }

  const busy = creating || updating || (isEdit && loadingExisting);

  return (
    <div className="mx-auto">
      <div>
        {error && (
          <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client (names dropdown) */}
          <Field label="Client" required>
            <select
              value={form.clientId}
              onChange={set("clientId")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loadingClients || busy}
            >
              <option value="">Select client…</option>
              {clientNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          {/* User (names dropdown) */}
          <Field label="User" required>
            <select
              value={form.userId}
              onChange={set("userId")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loadingUsers || busy}
            >
              <option value="">Select user…</option>
              {userNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          {/* Tracking ID */}
          <Field label="Tracking ID" required>
            <input
              type="text"
              value={form.trackingId}
              onChange={set("trackingId")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="TRK-0001"
              disabled={busy}
            />
          </Field>

          {/* Type */}
          <Field label="Type" required>
            <select
              value={form.type}
              onChange={set("type")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={busy}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </option>
              ))}
            </select>
          </Field>

          {/* Created At (optional) */}
          <Field label="Created At">
            <input
              type="datetime-local"
              value={form.createdAt}
              onChange={set("createdAt")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={busy}
            />
          </Field>

          {/* Description */}
          <div className="md:col-span-2">
            <Field label="Description" required>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="A short note about this activity…"
                disabled={busy}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate("/activities")}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || busy}
              className={`px-4 py-2 rounded-lg text-white ${
                !canSubmit || busy ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {busy ? <ClipLoader size={18} color="#fff" /> : (isEdit ? "Save Changes" : "Save Activity")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** helpers */
function toInputDateTime(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return "";
  }
}
