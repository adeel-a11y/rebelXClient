// src/pages/UserCreate.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../hooks/useUsers";
import { useToolbar } from "../../store/toolbar";
import { ClipLoader } from "react-spinners";
import SearchableSelect from "../../components/SearchableSelect";
import ToastNotification from "../../components/ToastNotification";

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
  "executive-assistant",
  "qc",
];

const STATUS_OPTIONS = ["active", "inactive"];

// simple email & phone validators
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

/* --------------------------------- INITIAL -------------------------------- */
const initial = {
  name: "",
  email: "",
  password: "",
  confirm: "",
  role: "employee",
  status: "active",
  department: "",
  phone: "",
  hourlyRate: "",
};

/* --------------------------------- PAGE ----------------------------------- */
export default function UserCreate() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateUser();
  const [form, setForm] = useState(initial);
  const [toast, setToast] = useState(null);

  useToolbar({
    title: "Add User",
    searchPlaceholder: "",
    actions: [
      {
        label: "Cancel",
        variant: "ghost",
        onClick: () => navigate("/users"),
      },
    ],
    backButton: true,
  });

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validationError = useMemo(() => {
    if (!form.name?.trim()) return "Please enter the user's full name.";
    if (!EMAIL_REGEX.test(form.email)) return "Please enter a valid email address.";
    if ((form.password || "").length < 6)
      return "Password must be at least 6 characters long.";
    if (!ROLES.includes(form.role))
      return "Please select a valid role from the list.";
    if (!STATUS_OPTIONS.includes(form.status))
      return "Please select a valid status.";
    if (form.phone?.trim() && !PHONE_REGEX.test(form.phone.trim()))
      return "Please enter a valid phone number like (561) 410-6868.";
    if (
      form.hourlyRate?.trim() &&
      Number.isNaN(Number(form.hourlyRate.trim()))
    )
      return "Hourly rate must be a numeric value (e.g. 19.00).";

    return "";
  }, [form]);

  const canSubmit = !validationError;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      setToast({
        type: "error",
        title: "Please check the form",
        message: validationError,
      });
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        status: form.status,
        department: form.department?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        hourlyRate: form.hourlyRate?.trim() || undefined,
      };

      await mutateAsync(payload);

      setToast({
        type: "success",
        title: "User created",
        message: `${payload.name} has been added successfully.`,
      });

      setTimeout(() => navigate("/users"), 600);
    } catch (err) {
      setToast({
        type: "error",
        title: "Failed to create user",
        message: err?.response?.data?.error || err?.message || "Something went wrong.",
      });
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-3 md:p-4 space-y-4"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              Add User
            </div>
            <div className="text-sm text-slate-500">
              Fill in the user details and save.
            </div>
          </div>
        </div>

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
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Minimum 6 characters"
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
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.hourlyRate}
            onChange={set("hourlyRate")}
            placeholder="$19.00"
          />
          {/* spacer to keep grid even */}
          <div className="hidden md:block" />
        </Section>

        {/* Actions */}
        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded-lg text-white ${
              isPending
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isPending ? <ClipLoader size={18} color="#fff" /> : "Save User"}
          </button>
        </div>
      </form>

      <ToastNotification
        open={!!toast}
        type={toast?.type}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </>
  );
}
