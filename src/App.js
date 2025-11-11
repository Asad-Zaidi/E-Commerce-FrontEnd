import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import "./styles/darkMode.css";

import Header from "./components/pages/user/Header";
import Footer from "./components/pages/user/Footer";
import Home from "./components/pages/user/Home";
import Product from "./components/pages/user/Product";
import ProductDetail from "./components/pages/user/ProductDetail";
import Checkout from "./components/pages/user/Checkout";
import About from "./components/pages/user/About";
import Contact from "./components/pages/user/Contact";
import Auth from "./components/pages/user/Auth";

import AdminLayout from "./components/pages/admin/AdminLayout";
import AdminLogin from "./components/pages/admin/AdminLogin";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import ProductList from "./components/pages/admin/ProductList";
import ProductForm from "./components/pages/admin/ProductForm";
import AdminCategories from "./components/pages/admin/AdminCategories";
import RequireAdmin from "./components/pages/admin/RequireAdmin";
import AdminContact from "./components/pages/admin/AdminContact";
import AdminBanners from "./components/pages/admin/AdminBanners";

import { setAuthToken } from "./api/api";

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  const token = localStorage.getItem("adminToken");
  if (token) setAuthToken(token);

  return (
    <>
      {/* 🧭 Show Header only on Public Pages */}
      {!isAdminRoute && <Header />}

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:category/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* 🧑‍💼 Admin Login (no sidebar) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🧑‍💻 Admin Layout (with sidebar) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="contact" element={<AdminContact />} />
            <Route
              path="banners"
              element={
                <RequireAdmin>
                  <AdminBanners />
                </RequireAdmin>
              }
            />
            <Route path="/admin/categories" element={<AdminCategories />} />
          </Route>

        </Routes>
      </main>

      {/* 🧭 Show Footer ONLY on Home Page */}
      {isHomePage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;