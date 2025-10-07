// src/api/users.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";


export async function getUsersLists({ page = 1, q = "", limit = 20, filters = {} }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q) params.set("q", q);

  // status: ['active','inactive']
  if (Array.isArray(filters.statuses) && filters.statuses.length) {
    // you can send as repeated or comma-separated. We'll do repeated for clarity:
    filters.statuses.forEach((s) => params.append("status", s));
  }
  // roles: array of strings
  if (Array.isArray(filters.roles) && filters.roles.length) {
    filters.roles.forEach((r) => params.append("role", r));
  }

  const res = await fetch(`${BASE_URL}/users/lists?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /api/users/lists failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getUsersSummary() {
  const res = await axios.get(`${BASE_URL}/users/lists/summary`);
  return res.data; // { success, total, byStatus:[{status,count,pct}], generatedAt }
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/users/lists/${id}`);
  if (!res.ok) throw new Error(`GET /api/users/lists/${id} failed`);
  return res.json();
}

export async function createUser(payload) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `POST /api/users failed ${res.status}`);
  }
  return res.json();
}

export async function updateUser(id, payload) {
  const res = await fetch(`${BASE_URL}/users/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PUT /api/users/lists/${id} failed`);
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `DELETE`);
  }
  return res.json();
}
