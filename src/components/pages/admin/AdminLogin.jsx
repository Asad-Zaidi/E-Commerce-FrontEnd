// src/components/admin/AdminLogin.jsx
import React, { useState } from "react";
import api, { setAuthToken } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    FiLock,
    FiMail,
    FiLogIn,
    FiAlertCircle,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.warning(
                <span className="flex items-center gap-2">
                    <FiAlertCircle />
                    Please fill in all fields
                </span>
            );
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const { token } = res.data;

            localStorage.setItem("adminToken", token);
            setAuthToken(token);

            toast.success(
                <span className="flex items-center gap-2">
                    <FiLogIn />
                    Login successful
                </span>
            );

            setTimeout(() => {
                nav("/admin/dashboard");
            }, 800);
        } catch (error) {
            toast.error(
                <span className="flex items-center gap-2">
                    <FiAlertCircle />
                    {error.response?.data?.message || "Login failed"}
                </span>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8"
            >
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
                    Admin Login
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    {/* Email */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Email address"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        <FiLogIn />
                        Login
                    </motion.button>
                </form>
            </motion.div>

            {/* Global Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <svg
                        className="animate-spin h-12 w-12 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
