import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import "./styles/darkMode.css";

import AdminAnalytics from "../components/pages/admin/AdminAnalytics";
import AdminLayout from "../components/pages/admin/AdminLayout";
import AdminLogin from "../components/pages/admin/AdminLogin";
import AdminDashboard from "../components/pages/admin/AdminDashboard";
import ProductList from "../components/pages/admin/ProductList";
import ProductForm from "../components/pages/admin/ProductForm";
import AdminCategories from "../components/pages/admin/AdminCategories";
import RequireAdmin from ".../components/pages/admin/RequireAdmin";
import AdminContact from "../components/pages/admin/AdminContact";
import AdminBanners from "../components/pages/admin/AdminBanners";
