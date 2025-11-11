// src/components/admin/AdminLogin.jsx
import React, { useState } from "react";
import api, { setAuthToken } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "../../../styles/AdminLogin.css";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            const { token } = res.data;
            localStorage.setItem("adminToken", token);
            setAuthToken(token);
            nav("/admin/dashboard");
        } catch (error) {
            setErr(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-box" onSubmit={submit}>
                <h2>Admin Login</h2>
                {err && <div style={{ color: "red" }}>{err}</div>}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
