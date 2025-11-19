import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "https://rebelxserver.onrender.com/api";

export const loginAccount = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, data);
        return response.data;
    } catch (error) {
        return error;
    }
};

