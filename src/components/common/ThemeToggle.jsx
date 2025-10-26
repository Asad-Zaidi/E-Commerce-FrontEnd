import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "./ThemeToggle.css";

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
            {darkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle;