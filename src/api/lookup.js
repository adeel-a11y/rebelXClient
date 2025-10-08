// src/api/lookups.js
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

function normalizeNamesResponse(res) {
  const d = res?.data ?? [];
  if (Array.isArray(d)) return d;          // plain array
  if (Array.isArray(d.data)) return d.data; // { data: [...] }
  return [];                                // fallback
}

/** GET /clients/lists/names?q=&limit= */
export async function getClientsNames(q = "", limit = 1000) {
  const params = {};
  if (q) params.q = q;
  if (limit) params.limit = limit;

  const res = await axios.get(`${BASE_URL}/clients/lists/names`, { params });
  return normalizeNamesResponse(res);
}

/** GET /users/lists/names?q=&limit= */
export async function getUsersNames(q = "", limit = 1000) {
  const params = {};
  if (q) params.q = q;
  if (limit) params.limit = limit;

  const res = await axios.get(`${BASE_URL}/users/lists/names`, { params });
  return normalizeNamesResponse(res);
}
