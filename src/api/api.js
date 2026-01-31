import axios from "axios";

// const API_BASE = "https://edm-website-backend.vercel.app";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";


const api = axios.create({
    baseURL: API_BASE + "/api",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
})

console.log("API Base URL:", API_BASE);

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log('Setting Auth Token:', token);
    }
    else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;
