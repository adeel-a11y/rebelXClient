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

export const monthlyNewClients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/clients`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getTopUsersByActivity = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/top-users`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getContactStatusBreakdown = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/contact-status-breakdown`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getCompanyTypeBreakdown = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/company-type-breakdown`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getContactTypeBreakdown = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/contact-type-breakdown`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getClientOrdersStats = async (externalId) => {
    try {
        const response = await axios.get(`${BASE_URL}/overview/client-orders-stats/${externalId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};
