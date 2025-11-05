// src/components/users/EditUser.jsx
import React, { useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

/* --------------------------------- CONSTS --------------------------------- */
const ROLES = [
  "admin",
  "manager",
  "employee",
  "sales",
  "sales-agent",
  "sales-executive",
  "warehouse",
  "shipping",
  "qc",
  "executive-assistant",
];

/* --------------------------- UI PRIMITIVE BLOCKS --------------------------- */
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

function Input({ label, required, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

function Select({ label, options = [], required, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <select
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
          </option>
        ))}
      </select>
    </label>
  );
}

/* --------------------------------- FORM ----------------------------------- */
/**
 * Props:
 *  - mode: "edit" | "create"
 *  - initial: existing user (for edit)
 *  - submitting: boolean
 *  - onSubmit(payload)
 *  - onCancel()
 */
export default function EditUser({
  mode = "edit",
  initial = {},
  submitting = false,
  onSubmit,
  onCancel,
}) {
  // normalize incoming values so validation is stable
  const initialRole = (initial.role ?? "employee").toString().toLowerCase();
  const initialStatus = (initial.status ?? "active").toString().toLowerCase();

  const [form, setForm] = useState({
    name: initial.name ?? "",
    email: initial.email ?? "",
    role: ROLES.includes(initialRole) ? initialRole : "employee",
    status: ["active", "inactive"].includes(initialStatus)
      ? initialStatus
      : "active",
    phone: initial.phone ?? "",
    hourlyRate: initial.hourlyRate ?? "",
    // only visible/validated when mode === "create"
    password: "",
    confirm: "",
  });

  const [clicked, setClicked] = useState(false); // NEW

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    setClicked(true); // NEW: show loader only after click

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      status: form.status,
      phone: form.phone?.trim() || undefined,
      hourlyRate: form.hourlyRate?.trim() || undefined,
    };
    if (mode === "create") payload.password = form.password;

    onSubmit?.(payload);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-3 md:p-4 space-y-4"
    >
      {/* Account */}
      <Section title="Account Information">
        <Input
          label="Full Name"
          value={form.name}
          onChange={set("name")}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="john@company.com"
          required
        />
      </Section>

      {/* Role & Status */}
      <Section title="Role & Status">
        <Select
          label="Role"
          value={form.role}
          onChange={set("role")}
          options={ROLES}
          required
        />

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600">Status *</span>
          <div className="flex items-center gap-4 rounded-lg border border-slate-300 px-3 py-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === "active"}
                onChange={set("status")}
              />
              <span>Active</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === "inactive"}
                onChange={set("status")}
              />
              <span>Inactive</span>
            </label>
          </div>
        </label>
      </Section>

      {/* Contact & Payroll */}
      <Section title="Contact & Payroll">
        <Input
          label="Phone"
          value={form.phone}
          onChange={set("phone")}
          placeholder="123-456-7890"
        />
        <Input
          label="Hourly Rate"
          value={form.hourlyRate}
          onChange={set("hourlyRate")}
          placeholder="e.g. 25"
        />
        {/* grid evenness */}
        <div className="hidden md:block" />
        <div className="hidden md:block" />
      </Section>

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          // Hamesha enabled rahe (validation pe nahi), lekin request ke dauran disable:
          disabled={submitting}
          className={`px-4 py-2 rounded-lg text-white ${
            submitting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {clicked && submitting ? (
            <ClipLoader size={18} color="#fff" />
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}
