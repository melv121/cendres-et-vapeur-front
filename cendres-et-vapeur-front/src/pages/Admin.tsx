import { useState } from "react";
import AdminProducts from "../components/admin/AdminProduct";
import AdminUsers from "../components/admin/AdminUsers";
import TelegraphChat from "../components/admin/TelegraphChat";
import SurvivorsLogWidget from "../components/admin/SurvivorsLogWidget";
import "../components/admin/admin.css";

type Tab = "products" | "users";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="adminPage">
      <header className="adminHeader">
        <div className="adminTitle">
          <h1>Dashboard Admin</h1>
          <p>Outils pour les grades élevés (Éditeurs / Admins)</p>
        </div>

        <div className="adminTabs">
          <button
            className={tab === "products" ? "active" : ""}
            onClick={() => setTab("products")}
          >
            Produits
          </button>
          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            Utilisateurs
          </button>
        </div>
      </header>

      <main className="adminGrid">
        <section className="adminPanel">
          {tab === "products" ? <AdminProducts /> : <AdminUsers />}
        </section>

        <aside className="adminSide">
          <div className="adminWidget">
            <TelegraphChat />
          </div>

          <div className="adminWidget">
            <SurvivorsLogWidget />
          </div>
        </aside>
      </main>
    </div>
  );
}