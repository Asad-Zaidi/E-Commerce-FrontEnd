import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import "./styles/darkMode.css";

import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import AdminCategories from "../pages/admin/AdminCategories";
import RequireAdmin from "../pages/admin/RequireAdmin";
import AdminContact from "../pages/admin/AdminContact";
import AdminBanners from "../pages/admin/AdminBanners";
