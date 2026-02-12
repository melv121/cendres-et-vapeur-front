import { useState } from "react";
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
import ProductDetail from "./pages/ProductDetail";
import AdminTelegraphPage from "./pages/admin/AdminTelegraphePage";
import AdminStatsPage from "./pages/admin/AdminStatsPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import JournalPage from "./pages/admin/JournalPage";
import Contact from "./pages/contact";
import CalendarPage from "./pages/admin/CalendarPage";
import NotAuthorized from "./pages/NotAuthorized";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { useToxicityMonitor } from "./hooks/useToxicityMonitor";

// Composants admin directs (avec API)
import AdminProducts from "./components/admin/AdminProduct";
import AdminUsers from "./components/admin/AdminUsers";

const Roles = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  USER: "USER",
  GUEST: "GUEST",
};




import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { isToxic, toxicityLevel, threshold, apiData } = useToxicityMonitor();
  const [showToxicity, setShowToxicity] = useState(true);

  return (
    <div className="app-container">
        {/* Bouton toggle toxicité */}
      <button
        onClick={() => setShowToxicity(!showToxicity)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 10000,
          background: isToxic ? '#cc0000' : '#009900',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={showToxicity ? 'Masquer la toxicité' : 'Afficher la toxicité'}
      >
        {showToxicity ? '×' : '☢'}
      </button>

        {/* Indicateur de toxicité */}
      {showToxicity && (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '46px',
        padding: '10px',
        backgroundColor: isToxic ? '#ff0000' : '#00ff00',
        color: isToxic ? '#ffffff' : '#000000',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {apiData?.alert_level || 'UNKNOWN'} - {apiData?.status || 'UNKNOWN'}
        </div>
        <div>
          Toxicité: {(toxicityLevel * 100).toFixed(1)}% / {(threshold * 100).toFixed(1)}%
          {isToxic && ' ⚠️ TOXIQUE'}
        </div>
        {apiData?.pollution && (
          <div style={{ fontSize: '10px', marginTop: '5px' }}>
            S: {apiData.pollution.sulfur?.toFixed(1)} |
            CO2: {apiData.pollution.carbon_dioxide?.toFixed(1)} |
            P: {apiData.pollution.particulates?.toFixed(1)} |
            O2: {apiData.pollution.oxygen?.toFixed(1)}
          </div>
        )}
      </div>
      )}
      
      {isAdminRoute ? <AdminHeader /> : <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/infos" element={<Infos />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/cart" element={<RoleProtectedRoute allowedRoles={[Roles.USER, Roles.EDITOR, Roles.ADMIN]} element={<Cart />} />} />

          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminPage />} />} />
          <Route path="/admin/produits" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminProducts />} />} />
          <Route path="/admin/utilisateurs" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminUsers />} />} />
          <Route path="/admin/messages" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminChatPage />} />} />
          <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminDashboardPage />} />} />
          <Route path="/admin/telegraphe" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminTelegraphPage />} />} />
          <Route path="/admin/statistiques" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<AdminStatsPage />} />} />
          <Route path="/admin/commandes" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<OrdersPage />} />} />
          <Route path="/admin/journal" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<JournalPage />} />} />
          <Route path="/admin/calendrier" element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} element={<CalendarPage />} />} />

          {/* Not authorized fallback */}
          <Route path="/not-authorized" element={<NotAuthorized />} />


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