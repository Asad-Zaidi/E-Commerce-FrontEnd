import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";


const api = axios.create({
    baseURL: API_BASE + "/api",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;
