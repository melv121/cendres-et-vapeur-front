import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Navbar";
import Footer from "./layout/footer/Footer";

import AdminHeader from "./layout/admin/AdminHeader";
import AdminFooter from "./layout/admin/AdminFooter";
import Infos from "./pages/infos";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import AdminPage from "./pages/Admin";
import Cart from "./pages/Cart";
import AdminTelegraphPage from "./pages/admin/AdminTelegraphePage";
import AdminStatsPage from "./pages/admin/AdminStatsPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import JournalPage from "./pages/admin/JournalPage";
import Contact from "./pages/contact";
import CalendarPage from "./pages/admin/CalendarPage";

// Composants admin directs (avec API)
import AdminProducts from "./components/admin/AdminProduct";
import AdminUsers from "./components/admin/AdminUsers";




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
          <Route path="/infos" element={<Infos />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/produits" element={<AdminProducts/>} />
          <Route path="/admin/utilisateurs" element={<AdminUsers />} />
          <Route path="/admin/messages" element={<AdminChatPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/telegraphe" element={<AdminTelegraphPage />} />
          <Route path="/admin/statistiques" element={<AdminStatsPage />} />
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