import { useMemo, useState } from "react";
import EditProductModal from "./modals/EditProductModal";
import "./admin.css";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "HIDDEN";
};

const INITIAL: Product[] = [
  { id: 1, name: "Kit de survie", price: 29, stock: 14, status: "ACTIVE" },
  { id: 2, name: "Ration militaire", price: 9, stock: 80, status: "ACTIVE" },
  { id: 3, name: "Lampe torche", price: 15, stock: 0, status: "HIDDEN" },
];

export default function AdminProducts() {
  const [rows, setRows] = useState<Product[]>(INITIAL);
  const [selected, setSelected] = useState<Product | null>(null);

  const total = useMemo(() => rows.length, [rows]);

  const onSave = async (p: Product) => {
    setRows((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    setSelected(null);
  };

  return (
    <div className="admBlock">
      <div className="admBlockHead">
        <div>
          <h2>Gestion Produits</h2>
          <p>{total} produit(s)</p>
        </div>

        <button
          className="admBtn"
          onClick={() => setRows(INITIAL)}
          title="Reset mock data"
        >
          Reset
        </button>
      </div>

      <div className="admTableWrap">
        <table className="admTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td>{r.name}</td>
                <td>{r.price} €</td>
                <td>{r.stock}</td>
                <td>
                  <span
                    className={`pill ${
                      r.status === "ACTIVE" ? "ok" : "warn"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className="admBtn ghost" onClick={() => setSelected(r)}>
                    Éditer
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  Aucun produit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <EditProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}