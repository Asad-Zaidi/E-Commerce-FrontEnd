import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    FaHome,
    FaBox,
    FaEnvelope,
    FaImages,
    FaListAlt,
    FaSignOutAlt,
    FaUserShield,
    FaBars,
    FaTimes,
    FaChartBar,
} from "react-icons/fa";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
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
                </nav>

                {/* Logout Button */}
                <div className="p-5 border-t border-white border-opacity-20">
                    <button
                        onClick={handleLogout}
                        className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-red hover:bg-opacity-10`}
                        title="Logout"
                    >
                        <FaSignOutAlt className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 p-3 transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-60'}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;