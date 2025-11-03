import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export async function getOrdersLists({
  page = 1,
  limit = 100,
  q = "",
  statuses = [],     // array -> server expects comma-separated
  datePreset = null, // 'today'|'this_month'|'this_year'|'prev_year'|null
  from,              // ISO date (YYYY-MM-DD)
  to,                // ISO date (YYYY-MM-DD)
  signal,
  headers = {},
} = {}) {
  console.log("orders inside  top =>", page, limit, q, statuses, from, to, datePreset, signal, headers)
  const res = await axios.get(`${BASE_URL}/sales/lists`, {
    params: {
      page,
      limit,
      q,
      statuses: statuses.join(","), // e.g., "pending,shipped"
      datePreset,
      from,
      to,
    },
    signal,
    headers,
  });
  const { data } = res;
  console.log("orders inside api =>", data)
  if (data?.success !== true) throw new Error(data?.message || "Fetch failed");
  return { data: data.data || [], pagination: data.pagination };
}

export async function getClientOrdersLists(externalId, {
  page = 1,
  limit = 10,
  q = "",
  statuses = [],     // array -> server expects comma-separated
  datePreset = null, // 'today'|'this_month'|'this_year'|'prev_year'|null
  from,              // ISO date (YYYY-MM-DD)
  to,                // ISO date (YYYY-MM-DD)
  signal,
  headers = {},
} = {}) {
  console.log(q)
  const res = await axios.get(`${BASE_URL}/sales/lists/client/${externalId}`, {
    params: {
      page,
      limit,
      q,
      statuses: statuses.join(","), // e.g., "pending,shipped"
      datePreset,
      from,
      to,
    },
    signal,
    headers,
  });
  const { data } = res;
  console.log("orders", data)
  console.log("sale client orders inside api =>", data)
  if (data?.success !== true) throw new Error(data?.message || "Fetch failed");
  return { data: data.data || [], pagination: data.pagination };
}

export async function getOrderById(id) {
  const res = await axios.get(`${BASE_URL}/sales/lists/${id}`);
  if (res.data?.success !== true) throw new Error(res.data?.message || "Get Order By Id failed");
  return res.data.data; // created sale order doc
}

export async function createOrder(payload, { headers = {}, signal } = {}) {
  const res = await axios.post(`${BASE_URL}/sales`, payload, { headers, signal });
  if (res.data?.success !== true) throw new Error(res.data?.message || "Create failed");
  return res.data.data; // created sale order doc
}

/** UPDATE */
export async function updateOrder(id, payload, { headers = {}, signal } = {}) {
  if (!id) throw new Error("Order id is required");
  const res = await axios.put(`${BASE_URL}/sales/update/${id}`, payload, { headers, signal });
  if (res.data?.success !== true) throw new Error(res.data?.message || "Update failed");
  return res.data.data; // updated doc (as returned by controller)
}

/** DELETE */
export async function deleteOrder(id, { headers = {}, signal } = {}) {
  if (!id) throw new Error("Order id is required");
  const res = await axios.delete(`${BASE_URL}/sales/delete/${id}`, { headers, signal });
  if (res.data?.success !== true) throw new Error(res.data?.message || "Delete failed");
  return res.data.data; // deleted doc
}