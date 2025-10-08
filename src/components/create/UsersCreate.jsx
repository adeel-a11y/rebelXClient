// src/pages/UserCreate.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../hooks/useUsers";
import { useToolbar } from "../../store/toolbar";
import { ClipLoader } from "react-spinners";

const ROLES = [
  "admin",
  "manager",
  "employee",
  "sales",
  "sales-agent",
  "sales-executive",
  "warehouse",
  "shipping",
];

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

export default function UserCreate() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateUser();

  useToolbar({
    title: "Add User",
    searchPlaceholder: "",
    actions: [{ label: "Cancel", variant: "ghost", onClick: () => navigate("/users") }],
  });

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!form.name?.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return false;
    if ((form.password || "").length < 6) return false;
    if (form.password !== form.confirm) return false;
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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto">
      <div className="">
        {error && (
          <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
            {error}
          </div>
        )}

        {/* {isPending && <ClipLoader />} */}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="john@company.com"
            />
          </div>

          {/* Password */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password <span className="text-rose-600">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="min 6 chars"
            />
          </div>

          {/* Confirm */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password <span className="text-rose-600">*</span>
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="repeat password"
            />
          </div>

          {/* Role */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
            <select
              value={form.role}
              onChange={set("role")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
            <div className="flex items-center gap-4">
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
          </div>

          {/* Department */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={set("department")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Sales"
            />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={set("phone")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="123-456-7890"
            />
          </div>

          {/* Hourly Rate */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate</label>
            <input
              type="text"
              min="0"
              step="0.01"
              value={form.hourlyRate}
              
              onChange={set("hourlyRate")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 25"
            />
          </div>

          {/* Actions */}
          <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 pt-2">
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
                !canSubmit || isPending
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isPending ? <ClipLoader size={18} color="#fff" /> : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
