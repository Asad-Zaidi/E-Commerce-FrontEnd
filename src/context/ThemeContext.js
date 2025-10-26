import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}