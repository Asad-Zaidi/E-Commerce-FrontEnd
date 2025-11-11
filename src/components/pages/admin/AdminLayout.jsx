import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBox,
    FaEnvelope,
    FaImages,
    FaListAlt,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import "../../../styles/AdminLayout.css";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Sidebar collapsed state (remembered in localStorage)
    const [collapsed, setCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", collapsed);
    }, [collapsed]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                {!collapsed && <h2 className="sidebar-title">Admin Panel</h2>}

                {/* Navigation */}
                <div className="sidebar-top">
                    <nav className="sidebar-nav">
                        <Link
                            to="/admin/dashboard"
                            className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
                        >
                            <FaTachometerAlt className="nav-icon" size={collapsed ? 25 : 22} />
                            {!collapsed && <span>Dashboard</span>}
                        </Link>

                        <Link
                            to="/admin/products"
                            className={`nav-item ${location.pathname.startsWith("/admin/products") ? "active" : ""}`}
                        >
                            <FaBox className="nav-icon" size={collapsed ? 25 : 22} />
                            {!collapsed && <span>Products</span>}
                        </Link>

                        {/* 🟢 NEW: Categories link */}
                        <Link
                            to="/admin/categories"
                            className={`nav-item ${location.pathname.startsWith("/admin/categories") ? "active" : ""}`}
                        >
                            <FaListAlt className="nav-icon" size={collapsed ? 25 : 22} />
                            {!collapsed && <span>Categories</span>}
                        </Link>

                        <Link
                            to="/admin/contact"
                            className={`nav-item ${location.pathname === "/admin/contact" ? "active" : ""}`}
                        >
                            <FaEnvelope className="nav-icon" size={collapsed ? 25 : 22} />
                            {!collapsed && <span>Contact</span>}
                        </Link>

                        <Link
                            to="/admin/banners"
                            className={`nav-item ${location.pathname === "/admin/banners" ? "active" : ""}`}
                        >
                            <FaImages className="nav-icon" size={collapsed ? 25 : 22} />
                            {!collapsed && <span>Banners</span>}
                        </Link>
                    </nav>
                </div>

                {/* Collapse Button */}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <FaChevronRight size={22} /> : <FaChevronLeft size={22} />}
                </button>

                {/* Logout Section */}
                <div className="sidebar-bottom">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt className="nav-icon" size={collapsed ? 36 : 20} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
