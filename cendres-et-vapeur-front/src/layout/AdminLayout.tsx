import { Outlet, NavLink } from "react-router-dom";
import "./adminLayout.css";

export default function AdminLayout() {
  return (
    <div className="adminShell">
      <header className="adminHeader">
        <div className="adminHeaderLeft">
          <div className="adminBadge">ADMIN</div>
          <div className="adminTitle">
            Château Valdrak • Dashboard
          </div>
        </div>

        <nav className="adminNav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/produits" className={({ isActive }) => (isActive ? "active" : "")}>
            Produits
          </NavLink>
          <NavLink to="/admin/utilisateurs" className={({ isActive }) => (isActive ? "active" : "")}>
            Utilisateurs
          </NavLink>
        </nav>
      </header>

      <main className="adminMain">
        <Outlet />
      </main>

      <footer className="adminFooter">
        <span>© {new Date().getFullYear()} Valdrak • Espace Admin</span>
        <span className="adminFooterRight">Mode sécurisé</span>
      </footer>
    </div>
  );
}
