import { useMemo, useEffect, useState } from "react";
import { getDashboardStats } from "../../api/api";
import "../admin/pagestyle/adminStats.css";

//local save pour tester la page
type User = { id: number; username: string };
type Product = { id: number; name: string; price: number; stock: number };
type Order = { id: number; status: "paid" | "pending" | "cancelled"; total_amount: number; created_at: string };

const usersSeed: User[] = [
  { id: 1, username: "admin.valdr" },
  { id: 2, username: "shaima" },
  { id: 3, username: "mouna" },
  { id: 4, username: "youssef" },
  { id: 5, username: "ines" },
];

const productsSeed: Product[] = [
  { id: 1, name: "Cigarillo Brume", price: 12.9, stock: 32 },
  { id: 2, name: "Boîte Cendre", price: 39.9, stock: 8 },
  { id: 3, name: "Vapeur Noire", price: 9.9, stock: 110 },
  { id: 4, name: "Coffret Fumée", price: 79.9, stock: 3 },
  { id: 5, name: "Potion Ambre", price: 19.9, stock: 22 },
  { id: 6, name: "Cendres & Luxe", price: 59.9, stock: 6 },
];

const now = Date.now();
const ordersSeed: Order[] = [
  { id: 101, status: "paid", total_amount: 129.9, created_at: new Date(now - 0 * 86400000).toISOString() },
  { id: 102, status: "pending", total_amount: 59.9, created_at: new Date(now - 0 * 86400000).toISOString() },
  { id: 103, status: "paid", total_amount: 19.9, created_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 104, status: "paid", total_amount: 79.9, created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 105, status: "cancelled", total_amount: 39.9, created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 106, status: "paid", total_amount: 12.9, created_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 107, status: "paid", total_amount: 59.9, created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 108, status: "pending", total_amount: 19.9, created_at: new Date(now - 6 * 86400000).toISOString() },
];

function formatEUR(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function AdminStatsPage() {
  const [totalUsers, setTotalUsers] = useState<number>(usersSeed.length);
  const [totalOrders, setTotalOrders] = useState<number>(ordersSeed.length);
  const [totalRevenue, setTotalRevenue] = useState<number>(() =>
    ordersSeed.filter((o) => o.status === "paid").reduce((s, o) => s + o.total_amount, 0)
  );
  const [top5Products, setTop5Products] = useState<Product[]>(() =>
    [...productsSeed].sort((a, b) => b.price - a.price).slice(0, 5)
  );

  const [ordersLast7, setOrdersLast7] = useState<number[] | null>(null);
  const [labels7, setLabels7] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: any = await getDashboardStats();
        if (!mounted) return;

        // Map common possible fields from backend
        if (typeof data.total_users === 'number') setTotalUsers(data.total_users);
        if (typeof data.total_orders === 'number') setTotalOrders(data.total_orders);
        if (typeof data.total_revenue === 'number') setTotalRevenue(data.total_revenue);

        if (Array.isArray(data.top_products)) {
          setTop5Products(data.top_products.slice(0, 5));
        }

        if (Array.isArray(data.orders_last_7_days)) {
          // Expect array of {date,count} or counts
          const counts: number[] = [];
          const labels: string[] = [];
          data.orders_last_7_days.slice(-7).forEach((it: any) => {
            if (typeof it === 'object') {
              labels.push(it.date ? new Date(it.date).toLocaleDateString('fr-FR', { weekday: 'short' }) : '-');
              counts.push(Number(it.count || it.value || 0));
            } else {
              labels.push('-');
              counts.push(Number(it || 0));
            }
          });
          setLabels7(labels);
          setOrdersLast7(counts);
        }

        // Some APIs may return a generic stats object
        if (data.stats) {
          const s = data.stats;
          if (typeof s.total_users === 'number') setTotalUsers(s.total_users);
          if (typeof s.total_orders === 'number') setTotalOrders(s.total_orders);
          if (typeof s.total_revenue === 'number') setTotalRevenue(s.total_revenue);
        }
      } catch (err: any) {
        console.error('getDashboardStats failed:', err);
        setError(err?.message || 'Erreur récupération stats');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // chart derived
  const chart = useMemo(() => {
    if (ordersLast7 && labels7) {
      const max = Math.max(1, ...ordersLast7);
      return { labels: labels7, counts: ordersLast7, max };
    }

    // fallback local
    const labels: string[] = [];
    const counts = Array(7).fill(0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      labels.push(d.toLocaleDateString('fr-FR', { weekday: 'short' }));
    }
    ordersSeed.forEach((o) => {
      const d = new Date(o.created_at);
      const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (diffDays < 0 || diffDays > 6) return;
      const index = 6 - diffDays;
      counts[index] += 1;
    });
    const max = Math.max(1, ...counts);
    return { labels, counts, max };
  }, [ordersLast7, labels7]);

  return (
    <div className="adminStatsPage">
      <div className="statsTop">
        <h1 className="statsTitle">Statistiques</h1>
      </div>

      <section className="statsGrid">
        <div className="statsCard">
          <p className="statsLabel">Commandes</p>
          <p className="statsValue">{loading ? '…' : totalOrders}</p>
          <p className="statsHint">Total enregistré</p>
        </div>

        <div className="statsCard">
          <p className="statsLabel">Utilisateurs</p>
          <p className="statsValue">{loading ? '…' : totalUsers}</p>
          <p className="statsHint">Comptes existants</p>
        </div>

        <div className="statsCard">
          <p className="statsLabel">Revenu total</p>
          <p className="statsValue">{loading ? '…' : formatEUR(totalRevenue)}</p>
          <p className="statsHint">Somme des commandes payées</p>
        </div>

        <div className="statsCard statsCardWide">
          <p className="statsLabel">Commandes (7 derniers jours)</p>

          <div className="chartWrap" aria-label="Graphique commandes sur 7 jours">
            {chart.labels.map((lab, i) => {
              const h = Math.round((chart.counts[i] / chart.max) * 100);
              return (
                <div className="barCol" key={lab + i}>
                  <div className="bar" style={{ height: `${h}%` }} title={`${chart.counts[i]} commandes`} />
                  <span className="barLabel">{lab}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="statsCard statsCardWide">
          <p className="statsLabel">Top 5 produits</p>

          <div className="topTable">
            <div className="topRow topHead">
              <span>Produit</span>
              <span>Stock</span>
              <span>Prix</span>
            </div>

            {top5Products.map((p) => (
              <div className="topRow" key={p.id}>
                <span className="topName">{p.name}</span>
                <span className={p.stock <= 5 ? "topStock low" : "topStock"}>{p.stock}</span>
                <span className="topPrice">{formatEUR((p as any).price || (p as any).current_price || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
