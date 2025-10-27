import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export const overviewAnalytics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview`);
        return response.data;
    } catch (error) {
        return error;
    }
};
