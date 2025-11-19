import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "https://rebelxserver.onrender.com/api";

export async function getOrderItemById(id, { headers = {}, signal } = {}) {
  const res = await axios.get(`${BASE_URL}/saleOrderDetails/lists/${id}`, { headers, signal });
  if (res.data?.success !== true) throw new Error(res.data?.message || "Get Order Item By Id failed");
  return res.data.data; // created sale order item doc
}

export async function createOrderItem(payload, { headers = {}, signal } = {}) {
  console.log("payload", payload);
  const res = await axios.post(`${BASE_URL}/saleOrderDetails`, payload, { headers, signal });
  console.log("res", res);
  if (res.data?.success !== true) throw new Error(res.data?.message || "Create failed");
  return res.data.data; // created sale order item doc
}

export async function updateOrderItem(id, payload, { headers = {}, signal } = {}) {
  console.log("id", id);
  console.log("payload", payload);
  const res = await axios.put(`${BASE_URL}/saleOrderDetails/update/${id}`, payload, { headers, signal });
  if (res.data?.success !== true) throw new Error(res.data?.message || "Update failed");
  return res.data.data; // created sale order item doc
}