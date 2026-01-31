import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUser, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
// import ThemeToggle from "../../common/ThemeToggle";
import { useUser } from "../../context/UserContext";

function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const menuRef = useRef(null);
    const profileRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        document.body.classList.toggle("menu-open");
    };

    const closeMenu = () => {
        setMenuOpen(false);
        document.body.classList.remove("menu-open");
    };

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                closeMenu();
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lock body scroll on mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

    // Update cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const items = JSON.parse(localStorage.getItem('checkoutItems') || '[]');
            const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartItemCount(totalCount);
        };

        updateCartCount();
        
        // Listen for storage changes
        window.addEventListener('storage', updateCartCount);
        // Listen for custom cart update event
        window.addEventListener('cartUpdated', updateCartCount);
        
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `relative font-medium transition-colors
         ${isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={closeMenu}
                        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                    >
                        ServiceHub
                    </NavLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/" end className={navLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={navLinkClass}>
                            Products
                        </NavLink>
                        <NavLink to="/blog" className={navLinkClass}>
                            Blog
                        </NavLink>
                        <NavLink to="/about" className={navLinkClass}>
                            About
                        </NavLink>
                        <NavLink to="/contact" className={navLinkClass}>
                            Contact
                        </NavLink>
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={() => navigate('/checkout')}
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Shopping Cart"
                        >
                            <FaShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            // Profile Dropdown for Logged In Users
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                                        <FaUser className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'Profile'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                        <NavLink
                                            to="/profile"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                closeMenu();
                                            }}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaUser className="w-4 h-4" />
                                                My Profile
                                            </div>
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                        >
                                            <FaSignOutAlt className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Login/Signup buttons for logged out users
                            <>
                                <NavLink to="/login">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition">
                                        Login
                                    </button>
                                </NavLink>

                                <NavLink to="/signup">
                                    <button className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                        Get Started
                                    </button>
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                <div
                    className={`absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl p-6 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <nav className="flex flex-col gap-6 mt-10">
                        <NavLink to="/" end onClick={closeMenu} className={navLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/products" onClick={closeMenu} className={navLinkClass}>
                            Products
                        </NavLink>
                        <NavLink to="/blog" onClick={closeMenu} className={navLinkClass}>
                            Blog
                        </NavLink>
                        <NavLink to="/about" onClick={closeMenu} className={navLinkClass}>
                            About
                        </NavLink>
                        <NavLink to="/contact" onClick={closeMenu} className={navLinkClass}>
                            Contact
                        </NavLink>

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                            {/* Cart Button */}
                            <button
                                onClick={() => {
                                    navigate('/checkout');
                                    closeMenu();
                                }}
                                className="flex items-center justify-between py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                            >
                                <div className="flex items-center gap-2">
                                    <FaShoppingCart className="w-4 h-4" />
                                    <span>Shopping Cart</span>
                                </div>
                                {cartItemCount > 0 && (
                                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {cartItemCount > 9 ? '9+' : cartItemCount}
                                    </span>
                                )}
                            </button>

                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/profile" onClick={closeMenu} className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4" />
                                            My Profile
                                        </div>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
                                    >
                                        <FaSignOutAlt className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" onClick={closeMenu}>
                                        <button className="w-full py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            Login
                                        </button>
                                    </NavLink>

                                    <NavLink to="/signup" onClick={closeMenu}>
                                        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                                            Get Started
                                        </button>
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
