import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/Auth.css";

function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

    const isLogin = location.pathname === "/login";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (isLogin) {
            console.log("Logging in:", formData);
            alert(`Login successful as ${formData.role || "User"}`);
            navigate("/");
        } else {
            console.log("Registering:", formData);
            alert(`Registration successful! Please log in.`);
            navigate("/login");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p>{isLogin ? "Login to continue" : "Join our platform today!"}</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group floating-label">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="name">Full Name</label>
                        </div>
                    )}

                    <div className="form-group floating-label">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email">Email Address</label>
                    </div>

                    <div className="form-group floating-label">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    {!isLogin && (
                        <div className="form-group floating-label">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    )}

                    {isLogin && (
                        <p className="forgot-password" onClick={() => alert("Feature coming soon!")}>
                            Forgot Password?
                        </p>
                    )}

                    {!isLogin && (
                        <div className="form-group floating-label">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled hidden></option>
                                <option value="customer">Customer</option>
                                <option value="vendor">Vendor</option>
                            </select>
                            <label>Select Role</label>
                        </div>
                    )}

                    <button type="submit" className="auth-btn">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span
                        className="auth-toggle-link"
                        onClick={() => navigate(isLogin ? "/register" : "/login")}
                    >
                        {isLogin ? "Register" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;
