// src/components/users/UsersForm.jsx
import React, { useMemo, useState } from "react";

const ROLES = [
  "admin","manager","employee","sales","sales-agent","sales-executive","warehouse","shipping",
];

export default function EditUser({ mode="create", initial, submitting, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "employee",
    status: initial?.status ?? "active",
    department: initial?.department ?? "",
    phone: initial?.phone ?? "",
    hourlyRate: initial?.hourlyRate ?? "",
    // only for create
    password: "",
    confirm: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = useMemo(() => {
    if (!form.name?.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return false;
    if (mode === "create") {
      if ((form.password || "").length < 6) return false;
      if (form.password !== form.confirm) return false;
    }
    if (!ROLES.includes(form.role)) return false;
    if (!["active","inactive"].includes(form.status)) return false;
    return true;
  }, [form, mode]);

  function handleSubmit(e){
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      status: form.status,
      department: form.department?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      hourlyRate: form.hourlyRate?.trim() || undefined,
    };
    if (mode === "create") payload.password = form.password;
    onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input className="w-full rounded-lg border px-3 py-2" value={form.name} onChange={set("name")} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input className="w-full rounded-lg border px-3 py-2" value={form.email} onChange={set("email")} type="email" />
      </div>

      {mode === "create" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input className="w-full rounded-lg border px-3 py-2" value={form.password} onChange={set("password")} type="password" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input className="w-full rounded-lg border px-3 py-2" value={form.confirm} onChange={set("confirm")} type="password" />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Role *</label>
        <select className="w-full rounded-lg border px-3 py-2" value={form.role} onChange={set("role")}>
          {ROLES.map(r => <option key={r} value={r}>{r.replace(/-/g," ").replace(/\b\w/g, m=>m.toUpperCase())}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status *</label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="status" value="active" checked={form.status==="active"} onChange={set("status")} />
            <span>Active</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="status" value="inactive" checked={form.status==="inactive"} onChange={set("status")} />
            <span>Inactive</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input className="w-full rounded-lg border px-3 py-2" value={form.department} onChange={set("department")} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input className="w-full rounded-lg border px-3 py-2" value={form.phone} onChange={set("phone")} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hourly Rate</label>
        <input className="w-full rounded-lg border px-3 py-2" value={form.hourlyRate} onChange={set("hourlyRate")} type="text" min="0" step="0.01" />
      </div>

      <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
        <button type="button" className="px-4 py-2 rounded-lg border" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={!canSubmit || submitting}
          className={`px-4 py-2 rounded-lg text-white ${(!canSubmit||submitting) ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
