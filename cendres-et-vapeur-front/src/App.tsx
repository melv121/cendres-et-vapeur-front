import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";

import AdminHeader from "./layout/admin/AdminHeader";
import AdminFooter from "./layout/admin/AdminFooter";

import Home from "./pages/Home";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Contact from "./pages/Contact";
import AdminPage from "./pages/Admin";

import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import JournalPage from "./pages/admin/JournalPage";
import CalendarPage from "./pages/admin/CalendarPage";




import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {isAdminRoute ? <AdminHeader /> : <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/produits" element={<AdminProductsPage />} />
          <Route path="/admin/utilisateurs" element={<AdminUsersPage />} />
          <Route path="/admin/messages" element={<AdminChatPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          <Route path="/admin/commandes" element={<OrdersPage />} />
          <Route path="/admin/journal" element={<JournalPage />} />
          <Route path="/admin/calendrier" element={<CalendarPage />} />


        </Routes>
      </main>

      {isAdminRoute ? <AdminFooter /> : <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
