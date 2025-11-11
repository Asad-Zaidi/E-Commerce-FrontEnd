// src/components/admin/RequireAdmin.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { setAuthToken } from "../../../api/api";

export default function RequireAdmin({ children }) {
    const token = localStorage.getItem("adminToken");

    // if token exists, set it for axios (so API calls work)
    if (token) setAuthToken(token);

    // simple guard: redirect to admin login if no token
    if (!token) return <Navigate to="/admin/login" replace />;

    return children;
}
