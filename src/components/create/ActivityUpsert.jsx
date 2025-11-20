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
import SearchableSelect from "../../components/SearchableSelect"; // Importing SearchableSelect component
import ToastNotification from "../../components/ToastNotification"; // Importing ToastNotification component

/* ------------------------------- constants ------------------------------- */
const TYPES = [
  "Call",
  "Email",
  "Text",
  "call_made",
  "status_changed",
  "note_added",
  "email_sent",
  "meeting_scheduled",
  "created",
];

const initial = {
  clientId: "", // (per your requirement) store/display NAME
  userId: "", // (per your requirement) store/display NAME
  type: "",
  description: "",
  createdAt: "", // blank => backend now()
};

/* --------------------------- UI primitive blocks -------------------------- */
function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
      <div className="text-sm font-semibold text-slate-800 mb-3">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children, full = false }) {
  return (
    <label
      className={["flex flex-col gap-1", full ? "md:col-span-2" : ""].join(" ")}
    >
      <span className="text-xs font-medium text-slate-600">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function Input({ ...props }) {
  return (
    <input
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
      {...props}
    />
  );
}

function Textarea({ rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
      {...props}
    />
  );
}

/* ---------------------------------- page ---------------------------------- */
export default function ActivityUpsert() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useToolbar({
    title: isEdit ? "Edit Activity" : "Add Activity",
    searchPlaceholder: "",
    backButton: true,
  });

  // load existing (edit)
  const { data: existing, isLoading: loadingExisting } = useActivity(
    id,
    isEdit
  );
  const { mutateAsync: createMutate, isPending: creating } =
    useCreateActivity();
  const { mutateAsync: updateMutate, isPending: updating } =
    useUpdateActivity();

  // lookups
  const { data: clientNames = [], isLoading: loadingClients } = useClientNames(
    "",
    1000,
    true
  );
  const { data: userNames = [], isLoading: loadingUsers } = useUserNames(
    "",
    1000,
    true
  );

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  console.log("form", existing, id, isEdit);

  // hydrate on edit
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        clientId: existing.clientId ?? "",
        userId: existing.userId ?? "",
        type: existing.type ?? "call_made",
        description: existing.description ?? "",
        createdAt: existing.createdAt
          ? toInputDateTime(existing.createdAt)
          : "",
      });
    }
  }, [isEdit, existing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = useMemo(() => {
    if (!form.clientId?.trim()) return false;
    if (!form.userId?.trim()) return false;
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
    const payload = {
      clientId: form.clientId.trim(), // NAME strings as requested
      userId: form.userId.trim(),
      type: form.type,
      description: form.description.trim(),
      ...(form.createdAt
        ? { createdAt: new Date(form.createdAt).toISOString() }
        : {}),
    };
    try {
      if (isEdit) {
        await updateMutate({ id, payload });
        setToast({
          open: true,
          type: "success",
          message: "Activity updated successfully!",
        });
      } else {
        await createMutate(payload);
        setToast({
          open: true,
          type: "success",
          message: "Activity created successfully!",
        });
      }
      navigate("/activities");
    } catch (err) {
      setError(err?.message || "Failed to save activity.");
      setToast({
        open: true,
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  }

  const busy = creating || updating || (isEdit && loadingExisting);
  const disableForm = busy || loadingClients || loadingUsers;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-3 md:p-4 space-y-4"
    >
      {/* header error */}
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {error}
        </div>
      )}

      {/* Section: Links */}
      <Section title="Links">
        <Field label="Client" required>
          <SearchableSelect
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            options={clientNames}
            placeholder="Select client"
          />
        </Field>

        <Field label="User" required>
          <SearchableSelect
            value={form.userId}
            onChange={set("userId")}
            disabled={disableForm}
            options={userNames}
            placeholder="Select user…"
          />
        </Field>
      </Section>

      {/* Section: Details */}
      <Section title="Details">
        <Field label="Type" required>
          <SearchableSelect
            value={form.type}
            onChange={set("type")}
            options={TYPES}
            placeholder="Select activity type"
          />
        </Field>

        <Field label="Created At">
          <Input
            type="datetime-local"
            value={form.createdAt}
            onChange={set("createdAt")}
            disabled={disableForm}
          />
        </Field>

        <Field label="Description" required full>
          <Textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="A short note about this activity…"
            disabled={disableForm}
          />
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
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
          disabled={busy}
          className={`px-4 py-2 rounded-lg text-white ${
            busy
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {busy ? (
            <ClipLoader size={18} color="#fff" />
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Save Activity"
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toast.open && (
        <ToastNotification
          open={toast.open}
          type={toast.type}
          title={toast.type === "success" ? "Success" : "Error"}
          message={toast.message}
          onClose={() => setToast({ ...toast, open: false })}
        />
      )}
    </form>
  );
}

/* -------------------------------- helpers -------------------------------- */
function toInputDateTime(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}
