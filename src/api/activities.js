// src/api/activities.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

// -------- helpers --------
function mapFiltersToParams({ types = [], datePreset = null } = {}) {
  const params = {};
  // type filters: UI -> API
  if (types?.length) {
    const map = { call: "call_made", email: "email_sent" };
    params.type = types.map((t) => map[t] ?? t).join(","); // "call_made,email_sent"
  }
  // date preset
  if (datePreset) {
    params.dateRange = datePreset; // 'today' | 'this_month' | 'this_year' | 'prev_year'
  }
  return params;
}

// -------- List (server-side pagination + filters) --------
export async function getActivitiesLists({
  page = 1,
  limit = 100,
  q = "",
  filters = {},
  from,
  to,
  sortBy = "createdAt",
  sort = "desc",
} = {}) {
  try {
    const params = {
      page,
      limit,
      sortBy,
      sort,
      ...(q ? { q } : {}),
      ...mapFiltersToParams(filters),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    };

    const res = await axios.get(`${BASE_URL}/activities/lists`, { params });
    const d = res.data || {};

    // ✅ New controller: { rows, meta }
    if (d.rows && d.meta) return d;

    // ✅ Your current shape per screenshot: { meta, data: [...] }
    if (Array.isArray(d.data) && d.meta && Number.isFinite(d.meta.total)) {
      return { rows: d.data, meta: d.meta };
    }

    // Legacy: { success, page, perPage, total, totalPages, data: [...] }
    if (Array.isArray(d.data) && Number.isFinite(d.total)) {
      return {
        rows: d.data,
        meta: {
          page: d.page ?? page,
          perPage: d.perPage ?? limit,
          total: d.total ?? 0,
          totalPages: d.totalPages ?? Math.max(Math.ceil((d.total ?? 0) / (d.perPage ?? limit)), 1),
        },
      };
    }

    // Fallback safe shape
    return { rows: [], meta: { page, perPage: limit, total: 0, totalPages: 1 } };
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}

export async function getActivitiesSummary({
  q = "",
  datePreset = null,
  from,
  to,
} = {}) {
  try {
    const params = {
      ...(q ? { q } : {}),
      ...(datePreset ? { dateRange: datePreset } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    };
    const res = await axios.get(`${BASE_URL}/activities/lists/summary`, { params });
    const d = res.data || {};
    // expect { totalCalls, totalEmails, total }
    return {
      totalCalls: Number(d.totalCalls || 0),
      totalEmails: Number(d.totalEmails || 0),
      total: Number(d.total || (d.totalCalls || 0) + (d.totalEmails || 0)),
    };
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}

// -------- CRUD (detail, create, update, delete) --------
export async function getActivityById(id) {
  try {
    const res = await axios.get(`${BASE_URL}/activities/lists/${id}`);
    // new ctrl: { success, data }
    // old ctrl: { success, data, count }
    return res?.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}

export async function createActivity(payload) {
  try {
    const res = await axios.post(`${BASE_URL}/activities`, payload);
    return res?.data?.data ?? res.data; // support both shapes
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}

export async function updateActivity(id, payload) {
  try {
    const res = await axios.patch(`${BASE_URL}/activities/update/${id}`, payload);
    return res?.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}

export async function deleteActivity(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/activities/delete/${id}`);
    return res?.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "Request failed";
    throw new Error(msg);
  }
}
