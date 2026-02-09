import { useState, useEffect } from "react";
import EditUserModal from "./modals/EditUserModal";
import { getUsers, updateUser, deleteUser } from "../../api/api";
import "./admin.css";

export type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  username?: string;
  role: "USER" | "EDITOR" | "ADMIN";
  active: boolean;
};

export default function AdminUsers() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  // Charger les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      // L'API retourne { success: true, users: [...] }
      const data = response.users || response || [];
      // Adapter les données de l'API au format du composant
      const users = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        fullName: user.username || user.fullName || 'Sans nom',
        role: user.role?.toUpperCase() || 'USER',
        active: user.active !== false,
      }));
      setRows(users);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
      console.error('Erreur API:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  const onSave = async (u: AdminUser) => {
    try {
      await updateUser(u.id, {
        email: u.email,
        username: u.fullName,
        role: u.role.toLowerCase(),
        active: u.active,
      });
      setRows((prev) => prev.map((x) => (x.id === u.id ? u : x)));
      setSelected(null);
    } catch (err: any) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admBlock">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admBlock">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#d4955f' }}>
          Erreur: {error}
        </p>
        <button className="admBtn" onClick={fetchUsers} style={{ display: 'block', margin: '0 auto' }}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="admBlock">
      <div className="admBlockHead">
        <div>
          <h2>Gestion Utilisateurs</h2>
          <p>{rows.length} utilisateur(s)</p>
        </div>

        <button className="admBtn" onClick={fetchUsers}>
          Actualiser
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
                  <button className="admBtn ghost" onClick={() => onDelete(r.id)} style={{ marginLeft: '5px' }}>
                    ✕
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