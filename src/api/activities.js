// src/api/activities.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";


export async function getActivitiesLists({ page = 1 } = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/activities/lists`, {
      params: { page }, // ?page=1
    });
    return res.data; // { success, page, perPage, total, totalPages, data: [...] }
  } catch (err) {
    // react-query ko error propagate karein
    const msg = err?.response?.data?.error || err.message || "Request failed";
    throw new Error(msg);
  }
}