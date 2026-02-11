import { useState } from "react";
import AdminHeader from "../layout/admin/AdminHeader";
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
      <AdminHeader />

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