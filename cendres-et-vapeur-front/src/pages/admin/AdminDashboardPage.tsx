import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLogs, getUsers, getProducts, getOrders, getShiftNotes } from "../../api/api";
import "../admin/pagestyle/adminDashboard.css";

type UserOut = {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  biography?: string | null;
};

type ProductOut = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  category_id: number;
  stock: number;
  base_price: number;
  current_price: number;
  popularity_score: number;
};

type OrderOut = {
  id: number;
  status: string;
  total_amount: string;
  invoice_file?: string | null;
  user_id: number;
  created_at?: string;
};

type ShiftNoteOut = {
  order_id: number;
  date: string;
  content: string;
  shift_type: string;
};

type Log = {
  id?: number;
  message?: string;
  action?: string;
  type?: string;
  user?: string;
  username?: string;
  created_at?: string;
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserOut[]>([]);
  const [products, setProducts] = useState<ProductOut[]>([]);
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [shiftNotes, setShiftNotes] = useState<ShiftNoteOut[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, productsData, ordersData, logsData, shiftsData] = await Promise.all([
          getUsers().catch(() => []),
          getProducts().catch(() => []),
          getOrders().catch(() => []),
          getLogs().catch(() => []),
          getShiftNotes().catch(() => []),
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setShiftNotes(Array.isArray(shiftsData) ? shiftsData : []);

        const logsArray = Array.isArray(logsData) ? logsData : [];
        setLogs(logsArray);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentOrders = useMemo(() => {
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

  return (
    <div className="adminDash">
      <div className="adminDashTop">
        <div>
          <h1 className="adminDashTitle">Tableau de bord</h1>
          <p className="adminDashSub">Vue d'ensemble de l'activité.</p>
        </div>

        <div className="adminDashActions">
          <button onClick={() => navigate("/admin/produits")}>+ Produit</button>
          <button onClick={() => navigate("/admin/utilisateurs")}>+ Utilisateur</button>
          <button onClick={() => navigate("/admin/commandes")}>Commandes</button>
        </div>
      </div>

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

      <div className="adminGrid">
        {/* Commandes récentes */}
        <section className="adminPanel">
          <div className="adminPanelHead">
            <h2>Commandes récentes</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/commandes")}>
              Voir tout
            </button>
          </div>

          {loading ? (
            <p className="adminMuted">Chargement...</p>
          ) : recentOrders.length === 0 ? (
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

        {/* Alertes stock */}
        <section className="adminPanel">
          <div className="adminPanelHead">
            <h2>Alertes stock</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/produits")}>
              Gérer stock
            </button>
          </div>

          {loading ? (
            <p className="adminMuted">Chargement...</p>
          ) : lowStock.length === 0 ? (
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

        {/* Journal d'activité */}
        <section className="adminPanel adminPanelWide">
          <div className="adminPanelHead">
            <h2>Journal d'activité</h2>
            <button className="adminLinkBtn" onClick={() => navigate("/admin/journal")}>
              Ouvrir
            </button>
          </div>

          {loading ? (
            <div className="adminMuted">Chargement...</div>
          ) : logs.length === 0 ? (
            <div className="adminMuted">Aucune activité</div>
          ) : (
            <ul className="adminList">
              {logs.slice(0, 5).map((log: Log, i: number) => (
                <li key={log.id || i} className="adminListItem">
                  <div className="adminListMain">
                    <div className="adminListTitle">{log.message || log.action || "Activité"}</div>
                    <div className="adminListSub">
                      {log.created_at ? new Date(log.created_at).toLocaleString("fr-FR") : "Récemment"}
                    </div>
                  </div>
                  <div className="adminPill">{log.user || log.username || log.type || "EVENT"}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function formatDate(dateTime?: string) {
  if (!dateTime) return "-";
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return dateTime;
  return d.toLocaleString("fr-FR");
}
