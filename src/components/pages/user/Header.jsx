import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "../../../styles/Header.css";
import ThemeToggle from "../../common/ThemeToggle";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
        document.body.classList.toggle("menu-open");
    };

    const closeMenu = () => {
        setMenuOpen(false);
        document.body.classList.remove("menu-open");
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [menuOpen]);

    return (
        <header className="header">
            {/* Left: Logo */}
            <div className="header-left">
                <NavLink to="/" onClick={closeMenu}>
                <h2>Service Hub</h2>
                </NavLink>
            </div>

            {/* Center: Nav Links */}
            <nav ref={menuRef} className={`nav-links ${menuOpen ? "open" : ""}`}>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={closeMenu}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={closeMenu}
                >
                    Products
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={closeMenu}
                >
                    About
                </NavLink>
                <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                    onClick={closeMenu}
                >
                    Contact
                </NavLink>

                {/* Buttons in Mobile Menu */}
                <div className="mobile-buttons">
                    <NavLink to="/login" onClick={closeMenu}>
                        <button className="btn-login">Login</button>
                    </NavLink>
                    <NavLink to="/register" onClick={closeMenu}>
                        <button className="btn-start">Get Started</button>
                    </NavLink>
                </div>
            </nav>

            {/* Right Buttons (Desktop) */}
            <div className="header-right">
                <ThemeToggle />
                <NavLink to="/login" className="nav-btn">
                    <button className="btn-login">Login</button>
                </NavLink>
                <NavLink to="/register" className="nav-btn">
                    <button className="btn-start">Get Started</button>
                </NavLink>
            </div>

            {/* Hamburger Icon */}
            <div className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? (
                    <FiX className="menu-icon" />
                ) : (
                    <FiMenu className="menu-icon" />
                )}
            </div>
        </header>
    );
}

export default Header;