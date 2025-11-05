// src/pages/UserCreate.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../hooks/useUsers";
import { useToolbar } from "../../store/toolbar";
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
  "executive-assistant",
  "qc",
];

/* --------------------------- UI PRIMITIVE BLOCKS --------------------------- */
function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
      <div className="text-sm font-semibold text-slate-800 mb-3">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">{children}</div>
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

  useToolbar({
    title: "Add User",
    searchPlaceholder: "",
    actions: [{ label: "Cancel", variant: "ghost", onClick: () => navigate("/users") }],
    backButton: true,
  });

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = useMemo(() => {
    if (!form.name?.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return false;
    if ((form.password || "").length < 6) return false;
    if (!ROLES.includes(form.role)) return false;
    if (!["active", "inactive"].includes(form.status)) return false;
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
      navigate("/users");
    } catch (err) {
      setError(err?.message || "Failed to create user.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto p-3 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-slate-900">Add User</div>
          <div className="text-sm text-slate-500">Fill in the user details and save.</div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {error}
        </div>
      )}

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
          disabled={!canSubmit || isPending}
          className={`px-4 py-2 rounded-lg text-white ${
            !canSubmit || isPending ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isPending ? <ClipLoader size={18} color="#fff" /> : "Save User"}
        </button>
      </div>
    </form>
  );
}
