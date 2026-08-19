import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Showcase from "./pages/Showcase";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import ServiceDetails from "./pages/ServiceDetails";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Jobs from "./pages/admin/Jobs";
import ProductsAdmin from "./pages/admin/Products";
import ServicesAdmin from "./pages/admin/Services";
import ShowcaseAdmin from "./pages/admin/Showcase";
import Contacts from "./pages/admin/Contacts";
import Applications from "./pages/admin/Applications";
import Settings from "./pages/admin/Settings";
import Media from "./pages/admin/Media";
import Partners from "./pages/admin/Partners";

import ProtectedRoute from "./components/admin/ProtectedRoute";


// =====================================================
// PUBLIC ROUTES
// =====================================================

function PublicRoutes() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/services/:slug"
          element={<ServiceDetails />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/showcase"
          element={<Showcase />}
        />

        <Route
          path="/careers"
          element={<Careers />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>

    </Routes>
  );
}


// =====================================================
// ADMIN ROUTES
// =====================================================

function AdminRoutes() {
  return (
    <Routes>

      {/* =========================
          ADMIN LOGIN
      ========================= */}

      <Route
        path="/admin/login"
        element={<Login />}
      />


      {/* =========================
          ADMIN PANEL
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="jobs"
          element={<Jobs />}
        />

        <Route
          path="services"
          element={<ServicesAdmin />}
        />

        <Route
          path="products"
          element={<ProductsAdmin />}
        />

        <Route
          path="showcase"
          element={<ShowcaseAdmin />}
        />

        <Route
          path="contacts"
          element={<Contacts />}
        />

        <Route
          path="applications"
          element={<Applications />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="media"
          element={<Media />}
        />

        <Route
          path="partners"
          element={<Partners />}
        />

      </Route>

    </Routes>
  );
}


// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {isAdminRoute ? (
        <AdminRoutes />
      ) : (
        <PublicRoutes />
      )}
    </>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;