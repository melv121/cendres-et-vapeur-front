import { useMemo, useState } from "react";

type CategoryOut = { id: number; name: string };

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

type ProductCreate = Omit<ProductOut, "id">;
type ProductUpdate = ProductCreate;

type Mode = "create" | "edit";

const categoriesSeed: CategoryOut[] = [
  { id: 1, name: "Armes" },
  { id: 2, name: "Défense" },
  { id: 3, name: "Rations" },
];

const productsSeed: ProductOut[] = [
  {
    id: 1,
    name: "Épée de Valdrak",
    description: "Lame forgée au cuivre noir — fiable et tranchante.",
    image_url: "",
    category_id: 1,
    stock: 12,
    base_price: 49.9,
    current_price: 59.9,
    popularity_score: 8.2,
  },
  {
    id: 2,
    name: "Bouclier de Cendres",
    description: "Résiste aux impacts, finition steampunk.",
    image_url: "",
    category_id: 2,
    stock: 6,
    base_price: 79.0,
    current_price: 89.0,
    popularity_score: 7.4,
  },
  {
    id: 3,
    name: "Potion de Brume",
    description: "Récupération rapide, usage strictement contrôlé.",
    image_url: "",
    category_id: 3,
    stock: 30,
    base_price: 9.5,
    current_price: 11.0,
    popularity_score: 9.1,
  },
];

const emptyProduct: ProductCreate = {
  name: "",
  description: "",
  image_url: "",
  category_id: 1,
  stock: 0,
  base_price: 0,
  current_price: 0,
  popularity_score: 0,
};

export default function AdminProductsStatic() {
  // ✅ local state (pas d’API)
  const [categories] = useState<CategoryOut[]>(categoriesSeed);
  const [products, setProducts] = useState<ProductOut[]>(productsSeed);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductCreate>({
    ...emptyProduct,
    category_id: categoriesSeed[0]?.id ?? 1,
  });

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      [p.name, p.description ?? "", String(p.category_id)].some((x) =>
        x.toLowerCase().includes(q)
      )
    );
  }, [products, query]);

  function openCreate() {
    setError(null);
    setMode("create");
    setEditingId(null);

    const firstCat = categories[0]?.id ?? 1;
    setForm({ ...emptyProduct, category_id: firstCat });

    setOpen(true);
  }

  function openEdit(p: ProductOut) {
    setError(null);
    setMode("edit");
    setEditingId(p.id);

    setForm({
      name: p.name,
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      category_id: p.category_id,
      stock: p.stock,
      base_price: p.base_price,
      current_price: p.current_price,
      popularity_score: p.popularity_score,
    });

    setOpen(true);
  }

  function onSubmit() {
    try {
      setError(null);

      // validations simples
      if (!form.name.trim()) {
        setError("Le nom du produit est obligatoire.");
        return;
      }
      if (!Number.isFinite(Number(form.stock)) || Number(form.stock) < 0) {
        setError("Stock invalide.");
        return;
      }

      const payload: ProductCreate = {
        ...form,
        category_id: Number(form.category_id),
        stock: Number(form.stock),
        base_price: Number(form.base_price),
        current_price: Number(form.current_price),
        popularity_score: Number(form.popularity_score),
        description: form.description?.trim() ? form.description : null,
        image_url: form.image_url?.trim() ? form.image_url : null,
      };

      if (mode === "create") {
        const nextId = (products.at(-1)?.id ?? 0) + 1;
        const created: ProductOut = { id: nextId, ...payload };
        setProducts((prev) => [created, ...prev]);
      } else {
        if (!editingId) return;

        const updatePayload: ProductUpdate = payload;
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { id: editingId, ...updatePayload } : p))
        );
      }

      setOpen(false);
    } catch (e: any) {
      setError("Erreur lors de l'enregistrement.");
    }
  }

  function onDelete(id: number) {
    const ok = confirm("Supprimer ce produit ?");
    if (!ok) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (nom, description, catégorie)…"
          style={{ padding: 10, borderRadius: 10, minWidth: 260 }}
        />

        <button onClick={openCreate} style={{ padding: "10px 14px", borderRadius: 10 }}>
          + Nouveau produit
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
              <th style={{ padding: 10 }}>Nom</th>
              <th style={{ padding: 10 }}>Catégorie</th>
              <th style={{ padding: 10 }}>Stock</th>
              <th style={{ padding: 10 }}>Prix</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <td style={{ padding: 10 }}>{p.id}</td>
                <td style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  {p.description && <div style={{ opacity: 0.8, fontSize: 13 }}>{p.description}</div>}
                </td>
                <td style={{ padding: 10 }}>
                  {categoryNameById.get(p.category_id) ?? `#${p.category_id}`}
                </td>
                <td style={{ padding: 10 }}>{p.stock}</td>
                <td style={{ padding: 10 }}>
                  <div>Base: {p.base_price}</div>
                  <div>Actuel: {p.current_price}</div>
                </td>
                <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => openEdit(p)} style={{ padding: "8px 10px", borderRadius: 10 }}>
                    Modifier
                  </button>
                  <button onClick={() => onDelete(p.id)} style={{ padding: "8px 10px", borderRadius: 10 }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12, opacity: 0.8 }}>
                  Aucun produit.
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
              width: "min(820px, 100%)",
              borderRadius: 16,
              padding: 16,
              background: "rgba(26,20,16,.98)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>{mode === "create" ? "Créer un produit" : "Modifier le produit"}</h2>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nom"
                style={{ padding: 10, borderRadius: 10 }}
              />

              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: Number(e.target.value) }))}
                style={{ padding: 10, borderRadius: 10 }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                value={form.stock}
                onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                placeholder="Stock"
                type="number"
                style={{ padding: 10, borderRadius: 10 }}
              />

              <input
                value={form.base_price}
                onChange={(e) => setForm((prev) => ({ ...prev, base_price: Number(e.target.value) }))}
                placeholder="Prix de base"
                type="number"
                step="0.01"
                style={{ padding: 10, borderRadius: 10 }}
              />

              <input
                value={form.current_price}
                onChange={(e) => setForm((prev) => ({ ...prev, current_price: Number(e.target.value) }))}
                placeholder="Prix actuel"
                type="number"
                step="0.01"
                style={{ padding: 10, borderRadius: 10 }}
              />

              <input
                value={form.popularity_score}
                onChange={(e) => setForm((prev) => ({ ...prev, popularity_score: Number(e.target.value) }))}
                placeholder="Score popularité"
                type="number"
                step="0.01"
                style={{ padding: 10, borderRadius: 10 }}
              />

              <input
                value={form.image_url ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="Image URL (optionnel)"
                style={{ padding: 10, borderRadius: 10, gridColumn: "1 / -1" }}
              />

              <textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optionnel)"
                style={{ padding: 10, borderRadius: 10, gridColumn: "1 / -1", minHeight: 90 }}
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
          </div>
        </div>
      )}
    </div>
  );
}
