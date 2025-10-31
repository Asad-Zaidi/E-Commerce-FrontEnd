import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
import "./styles/darkMode.css";

// 🧭 Public Routes
import Header from "./components/user/Header";
import Footer from "./components/user/Footer";
import Home from "./components/user/Home";
import Product from "./components/user/Product";
import ProductDetail from "./components/user/ProductDetail";
import About from "./components/user/About";
import Contact from "./components/user/Contact";
import Auth from "./components/user/Auth";

// 🧑‍💼 Admin Routes
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProductList from "./components/admin/ProductList";
import ProductForm from "./components/admin/ProductForm";
import AdminCategories from "./components/admin/AdminCategories";
import RequireAdmin from "./components/admin/RequireAdmin";
import AdminContact from "./components/admin/AdminContact";
import AdminBanners from "./components/admin/AdminBanners";



// 🛠️ API Config
import { setAuthToken } from "./api/api";

function AppContent() {
  const location = useLocation();

  // Hide Header/Footer on admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  // Set admin token if available
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
          <Route path="/products" element={<Product />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
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