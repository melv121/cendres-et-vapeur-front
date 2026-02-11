import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./adminLayout.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname === "/admin") return "Tableau de bord";
    if (location.pathname.startsWith("/admin/produits")) return "Produits";
    if (location.pathname.startsWith("/admin/utilisateurs")) return "Utilisateurs";
    if (location.pathname.startsWith("/admin/commandes")) return "Commandes";
    if (location.pathname.startsWith("/admin/calendrier")) return "Calendrier";
    if (location.pathname.startsWith("/admin/messages")) return "Messagerie";
    if (location.pathname.startsWith("/admin/journal")) return "Journal d’activité";
    return "Cendres et Vapeur";
  };

  return (
    <header className="adminHeader">
      <div className="adminHeaderLeft">
        <img src={logo} alt="Cendres et Vapeur" className="adminLogo" />
        <span className="adminTitle">{getTitle()}</span>
      </div>

      <nav className="adminNav">
  <div className="adminNavLinks">
    <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
      Dashboard
    </NavLink>

    <NavLink to="/admin/produits" className={({ isActive }) => (isActive ? "active" : "")}>
      Produits
    </NavLink>

    <NavLink to="/admin/utilisateurs" className={({ isActive }) => (isActive ? "active" : "")}>
      Utilisateurs
    </NavLink>

    <NavLink to="/admin/commandes" className={({ isActive }) => (isActive ? "active" : "")}>
      Commandes
    </NavLink>

    

    <NavLink to="/admin/calendrier" className={({ isActive }) => (isActive ? "active" : "")}>
      Calendrier
    </NavLink>

    <NavLink to="/admin/journal" className={({ isActive }) => (isActive ? "active" : "")}>
      Journal
    </NavLink>
  </div>

  <div className="adminNavActions">
    <button type="button" className="adminLogoutBtn" onClick={handleLogout}>
      Déconnexion
    </button>
  </div>
</nav>

    </header>
  );
}