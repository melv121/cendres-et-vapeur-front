import { useMemo, useState, useEffect } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../../api/api";

type Mode = "create" | "edit";

type OrderCreate = {
  status: string;
  total_amount: number | string;
  invoice_file?: string | null;
  user_id: number;
};

type OrderOut = {
  id: number;
  status: string;
  total_amount: string;
  invoice_file?: string | null;
  user_id: number;
  created_at?: string;
};

const emptyOrder: OrderCreate = {
  status: "pending",
  total_amount: 0,
  invoice_file: null,
  user_id: 1,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OrderCreate>(emptyOrder);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) =>
      [String(o.id), o.status, String(o.user_id), String(o.total_amount)].some((x) =>
        x.toLowerCase().includes(q)
      )
    );
  }, [orders, query]);

  function openCreate() {
    setError(null);
    setMode("create");
    setEditingId(null);
    setForm(emptyOrder);
    setOpen(true);
  }

  function openEdit(o: OrderOut) {
    setError(null);
    setMode("edit");
    setEditingId(o.id);
    setForm({
      status: o.status,
      total_amount: o.total_amount,
      invoice_file: o.invoice_file ?? null,
      user_id: o.user_id,
    });
    setOpen(true);
  }

  async function onSubmit() {
    try {
      setError(null);

      const payload: OrderCreate = {
        ...form,
        user_id: Number(form.user_id),
        total_amount:
          typeof form.total_amount === "string" ? form.total_amount : Number(form.total_amount),
        invoice_file: form.invoice_file?.trim() ? form.invoice_file : null,
        status: form.status?.trim() || "pending",
      };

      // validations simples
      if (!payload.status.trim()) {
        setError("Statut obligatoire.");
        return;
      }
      if (!String(payload.total_amount).trim()) {
        setError("Total obligatoire.");
        return;
      }
      if (!Number.isFinite(payload.user_id) || payload.user_id <= 0) {
        setError("user_id invalide.");
        return;
      }

      if (mode === "create") {
        const created = await createOrder({
          status: payload.status,
          total_amount: Number(payload.total_amount),
          user_id: payload.user_id,
          created_at: new Date().toISOString(),
        };

        setOrders((prev) => [...prev, created]);
        });
        setOrders((prev) => [created, ...prev]);
      } else {
        if (!editingId) return;
        const updated = await updateOrder(editingId, {
          status: payload.status,
          total_amount: Number(payload.total_amount),
          user_id: payload.user_id,
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editingId
              ? {
                ...o,
                status: updatePayload.status,
                total_amount: String(updatePayload.total_amount),
                invoice_file: updatePayload.invoice_file ?? null,
                user_id: updatePayload.user_id,
              }
              : o
          )
          prev.map((o) => (o.id === editingId ? updated : o))
        );
      }

      setOpen(false);
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'enregistrement.");
    }
  }

  async function onDelete(id: number) {
    const ok = confirm("Supprimer cette commande ?");
    if (!ok) return;

    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e: any) {
      setError(e.message || "Erreur lors de la suppression.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
    <section className="adminPage">
      <h1 className="adminPageTitle">Commandes</h1>

      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (id, statut, user_id, total)…"
          style={{ padding: 10, borderRadius: 10, minWidth: 260, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
        />

        <button onClick={openCreate} style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
          + Nouvelle commande
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openCreate} style={{ padding: "10px 14px", borderRadius: 10 }}>
            + Nouvelle commande
          </button>
          <button onClick={fetchOrders} style={{ padding: "10px 14px", borderRadius: 10 }}>
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,0,0,.3)" }}>
          {String(error)}
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>Chargement des commandes…</p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", backgroundColor: "rgba(184, 115, 51, 0.1)" }}>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>ID</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Statut</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Total</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>User</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Créée</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <td style={{ padding: 10, color: "#e8dcc8" }}>{o.id}</td>
                <td style={{ padding: 10, color: "#e8dcc8" }}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,.18)",
                      background: "rgba(255,255,255,.06)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: 12,
                      letterSpacing: ".08em",
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: 10, fontWeight: 800, color: "#e8dcc8" }}>{o.total_amount}</td>
                <td style={{ padding: 10, color: "#e8dcc8" }}>User #{o.user_id}</td>
                <td style={{ padding: 10, opacity: 0.8, fontSize: 13, color: "#e8dcc8" }}>{formatDate(o.created_at)}</td>
                <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => openEdit(o)} style={{ padding: "8px 10px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                    Modifier
                  </button>
                  <button onClick={() => onDelete(o.id)} style={{ padding: "8px 10px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12, opacity: 0.8 }}>
                  Aucune commande.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 2000,
            padding: 16,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              borderRadius: 16,
              padding: 16,
              background: "rgba(26,20,16,.98)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>
              {mode === "create" ? "Créer une commande" : "Modifier la commande"}
            </h2>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              >
                <option value="">-- Sélectionner un statut --</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                value={String(form.total_amount)}
                onChange={(e) => setForm((p) => ({ ...p, total_amount: e.target.value }))}
                placeholder="Total"
                type="number"
                step="0.01"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <input
                value={form.user_id}
                onChange={(e) => setForm((p) => ({ ...p, user_id: Number(e.target.value) }))}
                placeholder="user_id"
                type="number"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <input
                value={form.invoice_file ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, invoice_file: e.target.value }))}
                placeholder="invoice_file (url) optionnel"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button onClick={() => setOpen(false)} style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                Annuler
              </button>
              <button onClick={onSubmit} style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateTime?: string) {
  if (!dateTime) return "-";
  const d = new Date(dateTime);
  return isNaN(d.getTime()) ? dateTime : d.toLocaleString();
}