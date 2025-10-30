// src/api/clients.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

/**
 * GET /clients/lists with search + pagination + filters
 * filters = { statuses: string[], states: string[] }
 */
export async function getClientsLists({ page = 1, q = "", limit = 100, filters = {} }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (q) params.set("q", q);

  // send filters as CSV to keep things simple
  const statuses = Array.isArray(filters.statuses) ? filters.statuses.filter(Boolean) : [];
  const states   = Array.isArray(filters.states)   ? filters.states.filter(Boolean)   : [];

  if (statuses.length) params.set("statuses", statuses.join(","));
  if (states.length)   params.set("states", states.join(","));

  const url = `${BASE_URL}/clients/lists?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /clients/lists failed (${res.status}): ${text}`);
  }
  return res.json(); // backend returns { success, page, perPage, total, totalPages, data: [...] }
}

export async function getClientsSummary() {
  const res = await axios.get(`${BASE_URL}/clients/lists/summary`);
  return res.data; // { success, total, byStatus, generatedAt }
}

/** NEW: single, create, update, delete **/
export async function getClientById(id) {
  const res = await axios.get(`${BASE_URL}/clients/lists/${id}`);
  console.log(res.data);
  return res.data?.data;
}

// api/clients.js
export async function getActivitiesByClient(id, { page = 1, perPage = 50, q = "" } = {}) {
  const { data } = await axios.get(`${BASE_URL}/clients/lists/activities/${id}`, {
    params: { page, limit: perPage, q },
  });
  return data;
}

export async function createClient(payload) {
  const { data } = await axios.post(`${BASE_URL}/clients`, payload);
  return data; // created client doc
}

export async function updateClient(id, payload) {
  console.log(id, payload);
  const { data } = await axios.put(`${BASE_URL}/clients/update/${id}`, payload);
  return data; // updated client doc
}

export async function updateClientStatus(id, payload) {
  const { data } = await axios.put(`${BASE_URL}/clients/update-status/${id}`, payload);
  return data; // updated client doc
}

export async function deleteClient(id) {
  const { data } = await axios.delete(`${BASE_URL}/clients/delete/${id}`);
  return data;
}