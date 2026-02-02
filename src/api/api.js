import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_BASE;
const API_BASE = "http://localhost:5000";

console.log("API Base URL:", API_BASE);

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Forgot Password API Functions
export const apiForgotPassword = (data) => {
    return api.post('/auth/forgot-password', data);
};

export const apiVerifyOtp = (data) => {
    return api.post('/auth/verify-otp', data);
};

export const apiResetPassword = (data) => {
    return api.put('/auth/reset-password', data);
};

export default api;
