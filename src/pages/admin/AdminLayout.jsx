import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    FaHome,
    FaBox,
    FaEnvelope,
    FaImages,
    FaListAlt,
    FaSignOutAlt,
    FaKey,
    FaEye,
    FaEyeSlash,
    FaUserShield,
    FaBars,
    FaTimes,
    FaChartBar,
    FaShoppingCart,
} from "react-icons/fa";
import { FaBlog } from "react-icons/fa6";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { toast } from "react-toastify";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { logout } = useUser();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        logout();
        navigate("/", { replace: true });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetPasswordForm = () => {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordSubmitting) return;

        const { currentPassword, newPassword, confirmPassword } = passwordForm;
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (currentPassword === newPassword) {
            toast.error("New password must be different from current password");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setPasswordSubmitting(true);
            await api.put("/auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword,
            });
            toast.success("Password updated successfully");
            resetPasswordForm();
            setShowChangePassword(false);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update password";
            toast.error(message);
        } finally {
            setPasswordSubmitting(false);
        }
    };

    return (
        <>
            {/* Meta robots tags to prevent admin pages from being indexed */}
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex, nofollow" />
            </Helmet>

            <div className="flex min-h-screen ">
                {/* Collapsible Sidebar */}
                <div className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white shadow-2xl z-50 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[70px]' : 'w-60'}`}>
                    <div className="flex justify-between items-center p-5 border-b border-white border-opacity-20">
                        {!sidebarCollapsed && (
                            <h2 className="m-0 text-2xl flex items-center gap-2.5">
                                <FaUserShield /> Admin
                            </h2>
                        )}
                        <button
                            className="hover:bg-white hover:bg-opacity-10 border-none text-white w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center text-xl transition-all duration-300"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            {sidebarCollapsed ? <FaBars /> : <FaTimes />}
                        </button>
                    </div>
                    <nav className="flex-1 py-5 overflow-y-auto">
                        <Link
                            to="/admin/home"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/home' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Home"
                        >
                            <FaHome className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Home</span>}
                        </Link>
                        <Link
                            to="/admin/dashboard"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/dashboard' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Dashboard"
                        >
                            <FaChartBar className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Dashboard</span>}
                        </Link>
                        <Link
                            to="/admin/products"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/products' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Products"
                        >
                            <FaBox className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Products</span>}
                        </Link>
                        <Link
                            to="/admin/categories"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/categories' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Categories"
                        >
                            <FaListAlt className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Categories</span>}
                        </Link>
                        <Link
                            to="/admin/blog"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/blog' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Blogs"
                        >
                            <FaBlog className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Blogs</span>}
                        </Link>

                        <Link
                            to="/admin/contact"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/contact' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Contact"
                        >
                            <FaEnvelope className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Contact</span>}
                        </Link>
                        <Link
                            to="/admin/banners"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/banners' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Banners"
                        >
                            <FaImages className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Banners</span>}
                        </Link>
                        <Link
                            to="/admin/orders"
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${location.pathname === '/admin/orders' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            title="Orders"
                        >
                            <FaShoppingCart className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Orders</span>}
                        </Link>
                    </nav>

                    {/* Logout Button */}
                    <div className="border-t border-white border-opacity-20">
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-red hover:bg-opacity-10`}
                            title="Change Password"
                        >
                            <FaKey className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Change Password</span>}
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:text-red-600 hover:bg-white hover:bg-opacity-10`}
                            title="Logout"
                        >
                            <FaSignOutAlt className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1  transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-60'}`}>
                    <Outlet />
                </div>
            </div>

            {showChangePassword && (
                <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
                    <div className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Change Password</h3>
                            <button
                                onClick={() => {
                                    setShowChangePassword(false);
                                    resetPasswordForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={submitPasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                        aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowChangePassword(false);
                                        resetPasswordForm();
                                    }}
                                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordSubmitting}
                                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition text-sm font-medium disabled:opacity-50"
                                >
                                    {passwordSubmitting ? "Saving..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
                    <div className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-2xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
                        <p className="text-sm text-gray-300 mb-6">Are you sure you want to log out?</p>
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminLayout;