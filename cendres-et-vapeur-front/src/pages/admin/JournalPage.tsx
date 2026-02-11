import { useMemo, useState } from "react";

type LogItem = {
  type: "ORDER" | "PRODUCT" | "USER" | "SHIFT";
  title: string;
  timeLabel: string;
  meta?: string;
};

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
    stock: 12,
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
    stock: 30,
    base_price: 9.5,
    current_price: 11,
    popularity_score: 9.1,
  },
];

const ordersSeed: OrderOut[] = [
  {
    id: 101,
    status: "paid",
    total_amount: "129.90",
    user_id: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 102,
    status: "pending",
    total_amount: "59.90",
    user_id: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 103,
    status: "shipped",
    total_amount: "89.00",
    user_id: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

const shiftNotesSeed: ShiftNoteOut[] = [
  { order_id: 101, date: "2026-03-01", shift_type: "jour", content: "Contrôle stock + préparation expédition." },
  { order_id: 102, date: "2026-03-02", shift_type: "nuit", content: "Alerte: rupture bientôt sur Bouclier." },
  { order_id: 103, date: "2026-03-03", shift_type: "jour", content: "Vérif facture + suivi transporteur." },
];

export default function JournalPageStatic() {
  const [users] = useState<UserOut[]>(usersSeed);
  const [products] = useState<ProductOut[]>(productsSeed);
  const [orders] = useState<OrderOut[]>(ordersSeed);
  const [shiftNotes] = useState<ShiftNoteOut[]>(shiftNotesSeed);

  const logs = useMemo<LogItem[]>(() => {
    const items: LogItem[] = [];

    // Orders
    [...orders]
      .sort((a, b) => Date.parse(b.created_at || "") - Date.parse(a.created_at || ""))
      .slice(0, 8)
      .forEach((o) => {
        items.push({
          type: "ORDER",
          title: `Commande #${o.id} • ${o.status}`,
          timeLabel: o.created_at ? new Date(o.created_at).toLocaleString() : "-",
          meta: `Total: ${o.total_amount} • User: ${o.user_id}`,
        });
      });

    // Products
    [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
      .forEach((p) => {
        items.push({
          type: "PRODUCT",
          title: `Produit #${p.id} • ${p.name}`,
          timeLabel: "Récemment (ID)",
          meta: `Stock: ${p.stock} • Prix: ${p.current_price}`,
        });
      });

    // Users
    [...users]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
      .forEach((u) => {
        items.push({
          type: "USER",
          title: `Utilisateur #${u.id} • ${u.username}`,
          timeLabel: "Récemment (ID)",
          meta: `${u.email} • rôle: ${u.role}`,
        });
      });

    // Shift notes
    [...shiftNotes]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 8)
      .forEach((n) => {
        items.push({
          type: "SHIFT",
          title: `Note de quart • ${n.shift_type} • ${n.date}`,
          timeLabel: n.date,
          meta: `Order: ${n.order_id}`,
        });
      });

    // ORDER d'abord
    const weight = (t: LogItem["type"]) =>
      t === "ORDER" ? 0 : t === "SHIFT" ? 1 : t === "PRODUCT" ? 2 : 3;

    return items.sort((a, b) => weight(a.type) - weight(b.type)).slice(0, 30);
  }, [orders, products, users, shiftNotes]);

  return (
    <section className="adminPage">
      <h1 className="adminPageTitle">Journal d’activité</h1>
      <p className="adminPageSubtitle">Version statique (sans API) — pour tester l’UI.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {logs.map((l, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.04)",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 1000,
                    letterSpacing: ".12em",
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.18)",
                    background: "rgba(0,0,0,.22)",
                    opacity: 0.95,
                  }}
                >
                  {l.type}
                </span>
                <span>{l.title}</span>
              </div>

              {l.meta && <div style={{ opacity: 0.85, fontSize: 13, marginTop: 3 }}>{l.meta}</div>}
            </div>

            <div style={{ opacity: 0.85, fontWeight: 700 }}>{l.timeLabel}</div>
          </div>
        ))}

        {logs.length === 0 && <div style={{ opacity: 0.85 }}>Aucune activité.</div>}
      </div>
    </section>
  );
}