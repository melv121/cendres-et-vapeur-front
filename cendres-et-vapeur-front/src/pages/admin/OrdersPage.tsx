import { useMemo, useState } from "react";

type Mode = "create" | "edit";

type OrderCreate = {
  status: string;
  total_amount: number | string;
  invoice_file?: string | null;
  user_id: number;
};

type OrderUpdate = OrderCreate;

type OrderOut = {
  id: number;
  status: string;
  total_amount: string; // comme ton API
  invoice_file?: string | null;
  user_id: number;
  created_at?: string; // ISO
};

const seedOrders: OrderOut[] = [
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
];

const emptyOrder: OrderCreate = {
  status: "pending",
  total_amount: 0,
  invoice_file: null,
  user_id: 1,
};

export default function OrdersPageStatic() {
  const [orders, setOrders] = useState<OrderOut[]>(seedOrders);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<OrderCreate>(emptyOrder);

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

  function onSubmit() {
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
        const nextId = (orders.at(-1)?.id ?? 0) + 1;
        const created: OrderOut = {
          id: nextId,
          status: payload.status,
          total_amount: String(payload.total_amount),
          invoice_file: payload.invoice_file ?? null,
          user_id: payload.user_id,
          created_at: new Date().toISOString(),
        };

        setOrders((prev) => [created, ...prev]);
      } else {
        if (!editingId) return;

        const updatePayload: OrderUpdate = payload;
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
        );
      }

      setOpen(false);
    } catch (e: any) {
      setError("Erreur lors de l'enregistrement.");
    }
  }

  function onDelete(id: number) {
    const ok = confirm("Supprimer cette commande ?");
    if (!ok) return;

    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <section className="adminPage">
      <h1 className="adminPageTitle">Commandes</h1>
      <p className="adminPageSubtitle">Version statique (sans API) — pour tester l’UI.</p>

      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (id, statut, user_id, total)…"
          style={{ padding: 10, borderRadius: 10, minWidth: 280 }}
        />
        <button onClick={openCreate} style={{ padding: "10px 14px", borderRadius: 10 }}>
          + Nouvelle commande
        </button>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,0,0,.3)" }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: 10 }}>ID</th>
              <th style={{ padding: 10 }}>Statut</th>
              <th style={{ padding: 10 }}>Total</th>
              <th style={{ padding: 10 }}>User</th>
              <th style={{ padding: 10 }}>Créée</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <td style={{ padding: 10 }}>#{o.id}</td>
                <td style={{ padding: 10 }}>{o.status}</td>
                <td style={{ padding: 10 }}>{o.total_amount}</td>
                <td style={{ padding: 10 }}>{o.user_id}</td>
                <td style={{ padding: 10 }}>{formatDate(o.created_at)}</td>
                <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => openEdit(o)} style={{ padding: "8px 10px", borderRadius: 10 }}>
                    Modifier
                  </button>
                  <button onClick={() => onDelete(o.id)} style={{ padding: "8px 10px", borderRadius: 10 }}>
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

      {open && (
        <Modal onClose={() => setOpen(false)} title={mode === "create" ? "Créer une commande" : "Modifier la commande"}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <input
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              placeholder="Statut (pending/paid/...)"
              style={{ padding: 10, borderRadius: 10 }}
            />

            <input
              value={String(form.total_amount)}
              onChange={(e) => setForm((p) => ({ ...p, total_amount: e.target.value }))}
              placeholder="Total"
              style={{ padding: 10, borderRadius: 10 }}
            />

            <input
              value={form.user_id}
              onChange={(e) => setForm((p) => ({ ...p, user_id: Number(e.target.value) }))}
              placeholder="user_id"
              type="number"
              style={{ padding: 10, borderRadius: 10 }}
            />

            <input
              value={form.invoice_file ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, invoice_file: e.target.value }))}
              placeholder="invoice_file (url) optionnel"
              style={{ padding: 10, borderRadius: 10 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button onClick={() => setOpen(false)} style={{ padding: "10px 14px", borderRadius: 10 }}>
              Annuler
            </button>
            <button onClick={onSubmit} style={{ padding: "10px 14px", borderRadius: 10 }}>
              Enregistrer
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

function formatDate(dateTime?: string) {
  if (!dateTime) return "-";
  const d = new Date(dateTime);
  return isNaN(d.getTime()) ? dateTime : d.toLocaleString();
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
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
      onClick={onClose}
    >
      <div
        style={{
          width: "min(820px, 100%)",
          borderRadius: 16,
          padding: 16,
          background: "rgba(26,20,16,.98)",
          border: "1px solid rgba(255,255,255,.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
