import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiErrorMessage } from "../../api/errors";
import { getUsers } from "../../api/users.api";
import { getProducts } from "../../api/products.api";
import { getOrders } from "../../api/orders.api";
import { getShiftNotes } from "../../api/shiftNotes.api";

import type { UserOut, ProductOut, OrderOut, ShiftNoteOut } from "../../api/types";
import "./adminDashboard.css";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserOut[]>([]);
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [shiftNotes, setShiftNotes] = useState<ShiftNoteOut[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setError(null);
        setLoading(true);

        const [u, p, o, s] = await Promise.all([
          getUsers(),
          getProducts(),
          getOrders(),
          getShiftNotes(),
        ]);

        if (!mounted) return;
        setUsers(u);
        setProducts(p);
        setOrders(o);
        setShiftNotes(s);
      } catch (e: any) {
        if (!mounted) return;
        setError(apiErrorMessage(e, "Impossible de charger le tableau de bord"));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const recentOrders = useMemo(() => {
    // created_at = date-time
    const sorted = [...orders].sort((a, b) => {
      const ta = Date.parse(a.created_at || "");
      const tb = Date.parse(b.created_at || "");
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
    return sorted.slice(0, 5);
  }, [orders]);

  const lowStock = useMemo(() => {
    return products
      .filter((p) => Number(p.stock) <= 3)
      .sort((a, b) => Number(a.stock) - Number(b.stock))
      .slice(0, 5);
  }, [products]);

  if (loading) {
    return (
      <div className="adminDash">
        <h1 className="adminDashTitle">Tableau de bord</h1>
        <p className="adminDashSub">Chargement des données…</p>
      </div>
    );
  }

  return (
    <div className="adminDash">
      <div className="adminDashTop">
        <div>
          <h1 className="adminDashTitle">Tableau de bord</h1>
          <p className="adminDashSub">
            Vue d’ensemble : utilisateurs, produits, commandes, planning.
          </p>
        </div>

        <div className="adminDashActions">
          <button onClick={() => navigate("/admin/produits")}>+ Produit</button>
          <button onClick={() => navigate("/admin/utilisateurs")}>+ Utilisateur</button>
          <button onClick={() => navigate("/admin/commandes")}>Commandes</button>
        </div>
      </div>

      {error && <div className="adminDashError">{error}</div>}

      {/* Stats cards */}
      <div className="adminCards">
        <div className="adminCard" onClick={() => navigate("/admin/utilisateurs")} role="button">
          <div className="adminCardLabel">Utilisateurs</div>
          <div className="adminCardValue">{users.length}</div>
          <div className="adminCardHint">Gestion CRUD</div>
        </div>

        <div className="adminCard" onClick={() => navigate("/admin/produits")} role="button">
          <div className="adminCardLabel">Produits</div>
          <div className="adminCardValue">{products.length}</div>
          <div className="adminCardHint">Catalogue & stock</div>
        </div>

        <div className="adminCard" onClick={() => navigate("/admin/commandes")} role="button">
          <div className="adminCardLabel">Commandes</div>
          <div className="adminCardValue">{orders.length}</div>
          <div className="adminCardHint">Suivi & statuts</div>
        </div>

        <div className="adminCard" onClick={() => navigate("/admin/planning")} role="button">
          <div className="adminCardLabel">Notes de quart</div>
          <div className="adminCardValue">{shiftNotes.length}</div>
          <div className="adminCardHint">Planning & consignes</div>
        </div>
      </div>

      {/* Grid sections */}
      <div className="adminGrid">
        {/* Recent Orders */}
        <section className="adminPanel">
          <div className="adminPanelHead">
            <h2>Commandes récentes</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/commandes")}>
              Voir tout
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="adminMuted">Aucune commande.</p>
          ) : (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Statut</th>
                    <th>Total</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.status}</td>
                      <td>{o.total_amount}</td>
                      <td>{o.user_id}</td>
                      <td>{formatDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Stock Alerts */}
        <section className="adminPanel">
          <div className="adminPanelHead">
            <h2>Alertes stock</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/produits")}>
              Gérer stock
            </button>
          </div>

          {lowStock.length === 0 ? (
            <p className="adminMuted">Aucune alerte, stock OK ✅</p>
          ) : (
            <ul className="adminList">
              {lowStock.map((p) => (
                <li key={p.id} className="adminListItem">
                  <div className="adminListMain">
                    <div className="adminListTitle">{p.name}</div>
                    <div className="adminListSub">Produit #{p.id}</div>
                  </div>
                  <div className="adminPill">Stock: {p.stock}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Activity Log (mock pour le moment) */}
        <section className="adminPanel adminPanelWide">
          <div className="adminPanelHead">
            <h2>Journal d’activité</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/journal")}>
              Ouvrir
            </button>
          </div>

          <ul className="adminList">
            <li className="adminListItem">
              <div className="adminListMain">
                <div className="adminListTitle">Connexion admin</div>
                <div className="adminListSub">Il y a quelques instants</div>
              </div>
              <div className="adminPill">AUTH</div>
            </li>
            <li className="adminListItem">
              <div className="adminListMain">
                <div className="adminListTitle">Tableau de bord consulté</div>
                <div className="adminListSub">Aujourd’hui</div>
              </div>
              <div className="adminPill">SYSTEM</div>
            </li>
          </ul>

          <p className="adminMuted" style={{ marginTop: 8 }}>
            (On branchera l’API des logs dès que tu me donnes l’endpoint.)
          </p>
        </section>
      </div>
    </div>
  );
}

function formatDate(dateTime?: string) {
  if (!dateTime) return "-";
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return dateTime;
  return d.toLocaleString();
}
