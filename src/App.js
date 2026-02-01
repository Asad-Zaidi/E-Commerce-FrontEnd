import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./styles/darkMode.css";
import WebSiteSchema from "./components/SEO/WebSiteSchema";

import Header from "./pages/user/Header";
import Footer from "./pages/user/Footer";
import Home from "./pages/user/Home";
import Product from "./pages/user/Product";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/user/Profile";
import Blog from "./pages/user/Blog";
import BlogPost from "./pages/user/BlogPost";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminContact from "./pages/admin/AdminContact";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminBlog from "./pages/admin/AdminBlog";

import { setAuthToken } from "./api/api";

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  const token = localStorage.getItem("adminToken");
  if (token) setAuthToken(token);

  return (
    <>
      {/* Global WebSite Schema */}
      <WebSiteSchema />
      
      {/* 🧭 Show Header only on Public Pages */}
      {!isAdminRoute && <Header />}

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:category/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* 🧑‍💼 Admin Login - uses same Auth component */}
          <Route path="/admin/login" element={<Auth />} />

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
            <Route path="home" element={<AdminHome />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="blog" element={<AdminBlog />} />
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
        <UserProvider>
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;