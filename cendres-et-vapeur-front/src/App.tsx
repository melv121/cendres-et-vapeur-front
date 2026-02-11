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

import AdminChatPage from "./pages/admin/AdminChatPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import JournalPage from "./pages/admin/JournalPage";
import CalendarPage from "./pages/admin/CalendarPage";

// Composants admin directs (avec API)
import AdminProducts from "./components/admin/AdminProduct";
import AdminUsers from "./components/admin/AdminUsers";

import { useToxicityMonitor } from "./hooks/useToxicityMonitor";


import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { isToxic, toxicityLevel, threshold, apiData } = useToxicityMonitor();
  return (
    <div className="app-container">
        {/* Indicateur de toxicité */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: isToxic ? '#ff0000' : '#00ff00',
        color: isToxic ? '#ffffff' : '#000000',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: '9999',
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
      
      {isAdminRoute ? <AdminHeader /> : <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/infos" element={<Infos />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/produits" element={<AdminProducts/>} />
          <Route path="/admin/utilisateurs" element={<AdminUsers />} />
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