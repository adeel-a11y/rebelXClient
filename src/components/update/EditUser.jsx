// src/components/update/EditUser.jsx
import React, { useState, useMemo } from "react";
import { ClipLoader } from "react-spinners";
import SearchableSelect from "../SearchableSelect";

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

const STATUS_OPTIONS = ["active", "inactive"];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

/* --------------------------- UI PRIMITIVE BLOCKS --------------------------- */
function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
      <div className="text-sm font-semibold text-slate-800 mb-3">
        {title}
      </div>
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

/* --------------------------------- FORM ----------------------------------- */
/**
 * Props:
 *  - mode: "edit" | "create"
 *  - initial: existing user (for edit)
 *  - submitting: boolean
 *  - onSubmit(payload)
 *  - onCancel()
 *  - onValidationError?(message)
 */
export default function EditUser({
  mode = "edit",
  initial = {},
  submitting = false,
  onSubmit,
  onCancel,
  onValidationError,
}) {
  const initialRole = (initial.role ?? "employee").toString().toLowerCase();
  const initialStatus = (initial.status ?? "active").toString().toLowerCase();

  const [form, setForm] = useState({
    name: initial.name ?? "",
    email: initial.email ?? "",
    role: ROLES.includes(initialRole) ? initialRole : "employee",
    status: STATUS_OPTIONS.includes(initialStatus)
      ? initialStatus
      : "active",
    phone: initial.phone ?? "",
    hourlyRate: initial.hourlyRate ?? "",
    password: "",
    confirm: "",
  });

  console.log(initial);

  const [clicked, setClicked] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validationError = useMemo(() => {
    if (!form.name?.trim()) return "Please enter the user's full name.";
    if (!EMAIL_REGEX.test(form.email)) return "Please enter a valid email address.";
    if (!ROLES.includes(form.role)) return "Please select a valid role.";
    if (!STATUS_OPTIONS.includes(form.status))
      return "Please select a valid status.";
    if (form.phone?.trim() && !PHONE_REGEX.test(form.phone.trim()))
      return "Please enter a valid phone number.";
    if (!form.hourlyRate?.trim()) return "Hourly rate must be numeric.";
    return "";
  }, [form]); 

  function handleSubmit(e) {
    e.preventDefault();
    setClicked(true);

    if (validationError) {
      onValidationError?.(validationError);
      return;
    }

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
          placeholder="Sara Gomez"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="sarajeang.82@gmail.com"
          required
        />
      </Section>

      {/* Role & Status */}
      <Section title="Role & Status">
        <SearchableSelect
          label="Role *"
          value={form.role}
          onChange={set("role")}
          options={ROLES}
          placeholder="Search role (e.g. warehouse)"
        />
        <SearchableSelect
          label="Status *"
          value={form.status}
          onChange={set("status")}
          options={STATUS_OPTIONS}
          placeholder="Active / Inactive"
        />
      </Section>

      {/* Contact & Payroll */}
      <Section title="Contact & Payroll">
        <Input
          label="Phone"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="(561) 410-6868"
          pattern={PHONE_REGEX.source}
          title="Please enter a valid phone number like (561) 410-6868."
        />
        <Input
          label="Hourly Rate"
          // type="text"
          // inputMode="decimal"
          // step="0.01"
          // min="0"
          value={form.hourlyRate}
          onChange={set("hourlyRate")}
          placeholder="$19.00"
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
