// import React, { useState, useEffect, useRef } from "react";
// import { NavLink } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";
// import "../../../styles/Header.css";
// import ThemeToggle from "../../common/ThemeToggle";

// function Header() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const menuRef = useRef(null);

//     const toggleMenu = () => {
//         setMenuOpen((prev) => !prev);
//         document.body.classList.toggle("menu-open");
//     };

//     const closeMenu = () => {
//         setMenuOpen(false);
//         document.body.classList.remove("menu-open");
//     };


//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 closeMenu();
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);


//     useEffect(() => {
//         if (menuOpen) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "auto";
//         }
//     }, [menuOpen]);

//     return (
//         <header className="header">
//             {/* Left: Logo */}
//             <div className="header-left">
//                 <NavLink to="/" onClick={closeMenu}>
//                 <h2>Service Hub</h2>
//                 </NavLink>
//             </div>

//             {/* Center: Nav Links */}
//             <nav ref={menuRef} className={`nav-links ${menuOpen ? "open" : ""}`}>
//                 <NavLink
//                     to="/"
//                     end
//                     className={({ isActive }) => (isActive ? "active-link" : "")}
//                     onClick={closeMenu}
//                 >
//                     Home
//                 </NavLink>
//                 <NavLink
//                     to="/products"
//                     className={({ isActive }) => (isActive ? "active-link" : "")}
//                     onClick={closeMenu}
//                 >
//                     Products
//                 </NavLink>
//                 <NavLink
//                     to="/about"
//                     className={({ isActive }) => (isActive ? "active-link" : "")}
//                     onClick={closeMenu}
//                 >
//                     About
//                 </NavLink>
//                 <NavLink
//                     to="/contact"
//                     className={({ isActive }) => (isActive ? "active-link" : "")}
//                     onClick={closeMenu}
//                 >
//                     Contact
//                 </NavLink>

//                 {/* Buttons in Mobile Menu */}
//                 <div className="mobile-buttons">
//                     <NavLink to="/login" onClick={closeMenu}>
//                         <button className="btn-login">Login</button>
//                     </NavLink>
//                     <NavLink to="/register" onClick={closeMenu}>
//                         <button className="btn-start">Get Started</button>
//                     </NavLink>
//                 </div>
//             </nav>

//             {/* Right Buttons (Desktop) */}
//             <div className="header-right">
//                 <ThemeToggle />
//                 <NavLink to="/login" className="nav-btn">
//                     <button className="btn-login">Login</button>
//                 </NavLink>
//                 <NavLink to="/register" className="nav-btn">
//                     <button className="btn-start">Get Started</button>
//                 </NavLink>
//             </div>

//             {/* Hamburger Icon */}
//             <div className="menu-toggle" onClick={toggleMenu}>
//                 {menuOpen ? (
//                     <FiX className="menu-icon" />
//                 ) : (
//                     <FiMenu className="menu-icon" />
//                 )}
//             </div>
//         </header>
//     );
// }

// export default Header;


import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "../../common/ThemeToggle";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lock body scroll on mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

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
                        <NavLink to="/about" className={navLinkClass}>
                            About
                        </NavLink>
                        <NavLink to="/contact" className={navLinkClass}>
                            Contact
                        </NavLink>
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />

                        <NavLink to="/login">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition">
                                Login
                            </button>
                        </NavLink>

                        <NavLink to="/register">
                            <button className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                Get Started
                            </button>
                        </NavLink>
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
                        <NavLink to="/about" onClick={closeMenu} className={navLinkClass}>
                            About
                        </NavLink>
                        <NavLink to="/contact" onClick={closeMenu} className={navLinkClass}>
                            Contact
                        </NavLink>

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                            <ThemeToggle />

                            <NavLink to="/login" onClick={closeMenu}>
                                <button className="w-full py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg">
                                    Login
                                </button>
                            </NavLink>

                            <NavLink to="/register" onClick={closeMenu}>
                                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                                    Get Started
                                </button>
                            </NavLink>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
