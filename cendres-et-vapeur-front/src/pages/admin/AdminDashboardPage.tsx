import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminDashboard.css";

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
  date: string; // YYYY-MM-DD
  content: string;
  shift_type: string;
};

const usersSeed: UserOut[] = [
  { id: 1, username: "admin.valdrak", email: "admin@valdrak.io", role: "admin" },
  { id: 2, username: "editor.steam", email: "editor@valdrak.io", role: "editor" },
  { id: 3, username: "user.cendres", email: "user@valdrak.io", role: "user" },
  { id: 4, username: "mina", email: "mina@valdrak.io", role: "user" },
];

const productsSeed: ProductOut[] = [
  {
    id: 11,
    name: "Épée de Valdrak",
    description: "Lame forgée au cuivre noir.",
    image_url: null,
    category_id: 1,
    stock: 2,
    base_price: 49.9,
    current_price: 59.9,
    popularity_score: 8.2,
  },
  {
    id: 12,
    name: "Bouclier de Cendres",
    description: "Finition steampunk, très résistant.",
    image_url: null,
    category_id: 2,
    stock: 6,
    base_price: 79,
    current_price: 89,
    popularity_score: 7.4,
  },
  {
    id: 13,
    name: "Potion de Brume",
    description: "Récupération rapide (usage contrôlé).",
    image_url: null,
    category_id: 3,
    stock: 3,
    base_price: 9.5,
    current_price: 11,
    popularity_score: 9.1,
  },
  {
    id: 14,
    name: "Gants d’Acier",
    description: "Protection renforcée.",
    image_url: null,
    category_id: 2,
    stock: 12,
    base_price: 19.9,
    current_price: 22.9,
    popularity_score: 6.1,
  },
];

const ordersSeed: OrderOut[] = [
  {
    id: 101,
    status: "paid",
    total_amount: "129.90",
    invoice_file: null,
    user_id: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 102,
    status: "pending",
    total_amount: "59.90",
    invoice_file: "https://example.com/invoice/102.pdf",
    user_id: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 103,
    status: "shipped",
    total_amount: "89.00",
    invoice_file: null,
    user_id: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 104,
    status: "cancelled",
    total_amount: "11.00",
    invoice_file: null,
    user_id: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const shiftNotesSeed: ShiftNoteOut[] = [
  { order_id: 101, date: "2026-03-01", shift_type: "jour", content: "Contrôle stock + préparation expédition." },
  { order_id: 102, date: "2026-03-02", shift_type: "nuit", content: "Alerte: rupture bientôt sur Bouclier." },
  { order_id: 103, date: "2026-03-03", shift_type: "urgent", content: "Incident livraison → contacter transporteur." },
];

export default function AdminDashboardPageStatic() {
  const navigate = useNavigate();

  
  const [users] = useState<UserOut[]>(usersSeed);
  const [products] = useState<ProductOut[]>(productsSeed);
  const [orders] = useState<OrderOut[]>(ordersSeed);
  const [shiftNotes] = useState<ShiftNoteOut[]>(shiftNotesSeed);

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
          <p className="adminDashSub">Version statique (sans API) — vue d’ensemble.</p>
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
                <div className="adminListTitle">Ajout note de quart</div>
                <div className="adminListSub">Aujourd’hui</div>
              </div>
              <div className="adminPill">SHIFT</div>
            </li>

            <li className="adminListItem">
              <div className="adminListMain">
                <div className="adminListTitle">Vérification stock critique</div>
                <div className="adminListSub">Aujourd’hui</div>
              </div>
              <div className="adminPill">SYSTEM</div>
            </li>
          </ul>

          <p className="adminMuted" style={{ marginTop: 8 }}>
            (Version statique : logs fictifs)
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
