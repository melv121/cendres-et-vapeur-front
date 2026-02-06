import { useState } from "react";
import EditUserModal from "./modals/EditUserModal";
import "./admin.css";

export type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  role: "USER" | "EDITOR" | "ADMIN";
  active: boolean;
};

const INITIAL: AdminUser[] = [
  { id: 1, email: "admin@mail.com", fullName: "Admin Boss", role: "ADMIN", active: true },
  { id: 2, email: "editor@mail.com", fullName: "Editor Pro", role: "EDITOR", active: true },
  { id: 3, email: "user@mail.com", fullName: "User Normal", role: "USER", active: false },
];

export default function AdminUsers() {
  const [rows, setRows] = useState<AdminUser[]>(INITIAL);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const onSave = async (u: AdminUser) => {
    setRows((prev) => prev.map((x) => (x.id === u.id ? u : x)));
    setSelected(null);
  };

  return (
    <div className="admBlock">
      <div className="admBlockHead">
        <div>
          <h2>Gestion Utilisateurs</h2>
          <p>{rows.length} utilisateur(s)</p>
        </div>

        <button className="admBtn" onClick={() => setRows(INITIAL)}>
          Reset
        </button>
      </div>

      <div className="admTableWrap">
        <table className="admTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Actif</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono">{r.id}</td>
                <td className="mono">{r.email}</td>
                <td>{r.fullName}</td>
                <td>
                  <span
                    className={`pill ${
                      r.role === "ADMIN"
                        ? "ok"
                        : r.role === "EDITOR"
                        ? "mid"
                        : "plain"
                    }`}
                  >
                    {r.role}
                  </span>
                </td>
                <td>{r.active ? "oui" : "non"}</td>
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
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <EditUserModal
          user={selected}
          onClose={() => setSelected(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}