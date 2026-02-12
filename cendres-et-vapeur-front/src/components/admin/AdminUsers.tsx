import { useMemo, useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/api";

type Mode = "create" | "edit";

type UserOut = {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  biography?: string | null;
};

type UserCreate = {
  username: string;
  email: string;
  password: string;
  avatar_url?: string | null;
  biography?: string | null;
};

const emptyCreate: UserCreate & { role?: string } = {
  username: "",
  email: "",
  password: "",
  avatar_url: null,
  biography: "",
  role: "user",
};

export default function AdminUsersStatic() {
  const [users, setUsers] = useState<UserOut[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<UserCreate & { role?: string }>(emptyCreate);

  const isCurrentAdmin = (() => {
    try {
      const u = localStorage.getItem('cev_auth_user');
      if (!u) return false;
      const obj = JSON.parse(u);
      return String(obj.role).toUpperCase() === 'ADMIN';
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data?.detail) {
          setError(data.detail);
        }
      } catch (err: any) {
        console.error('Erreur chargement users:', err);
        setError('Serveur indisponible (502). Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.email, u.role].some((x) => (x ?? "").toLowerCase().includes(q))
    );
  }, [users, query]);

  function openCreate() {
    setError(null);
    setMode("create");
    setEditingId(null);
    setForm({ ...emptyCreate, role: "user" });
    setOpen(true);
  }

  function openEdit(u: UserOut) {
    setError(null);
    setMode("edit");
    setEditingId(u.id);
    setForm({
      username: u.username,
      email: u.email,
      password: "", 
      avatar_url: u.avatar_url ?? "",
      biography: u.biography ?? "",
      role: u.role,
    });
    setOpen(true);
  }

  async function onSubmit() {
    try {
      setError(null);

      if (!form.username.trim()) {
        setError("Le username est obligatoire.");
        return;
      }
      if (!form.email.trim()) {
        setError("L’email est obligatoire.");
        return;
      }

      if (mode === "create") {
        if (!form.password.trim()) {
          setError("Le mot de passe est obligatoire en création.");
          return;
        }

        const created = await createUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          avatar_url: form.avatar_url?.trim() || null,
          biography: form.biography?.trim() || null,
          role: (form.role || 'user').toLowerCase(),
        });

        setUsers((prev) => [created, ...prev]);
        try { window.dispatchEvent(new Event('dataChanged')); } catch (_) { }
      } else {
        if (!editingId) return;

        const payload: any = {
          username: form.username.trim(),
          email: form.email.trim(),
          avatar_url: form.avatar_url?.trim() || null,
          biography: form.biography?.trim() || null,
        };

        payload.password = form.password?.trim() || "UNCHANGED";

        if (form.role?.trim()) payload.role = form.role.trim().toLowerCase();

        console.log('Update payload:', payload);
        await updateUser(editingId, payload);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingId
              ? {
                ...u,
                username: payload.username,
                email: payload.email,
                role: payload.role ?? u.role,
                avatar_url: payload.avatar_url ?? null,
                biography: payload.biography ?? null,
              }
              : u
          )
        );
        try { window.dispatchEvent(new Event('dataChanged')); } catch (_) { }
      }

      setOpen(false);
    } catch (e: any) {
      console.error('Create/update user failed', e);
      console.error('Full error:', JSON.stringify(e, null, 2));
      setError(e?.message || e?.toString() || "Erreur lors de l'enregistrement.");
    }
  }

  async function onDelete(id: number) {
    const ok = confirm("Supprimer cet utilisateur ?");
    if (!ok) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      try { window.dispatchEvent(new Event('dataChanged')); } catch (_) { }
    } catch (err: any) {
      console.error('Erreur suppression user:', err);
      setError("Erreur lors de la suppression.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {loading && (
        <div style={{ padding: 20, textAlign: 'center', color: '#d4955f' }}>
          Chargement des utilisateurs...
        </div>
      )}

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
          placeholder="Rechercher (username, email, rôle)…"
          style={{ padding: 10, borderRadius: 10, minWidth: 260, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openCreate} style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
            + Nouvel utilisateur
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,0,0,.3)" }}>
          {String(error)}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", backgroundColor: "rgba(184, 115, 51, 0.1)" }}>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>ID</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Username</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Email</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Rôle</th>
              <th style={{ padding: 10, color: "#d4955f", fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <td style={{ padding: 10, color: "#e8dcc8" }}>{u.id}</td>
                <td style={{ padding: 10, color: "#e8dcc8" }}>
                  <div style={{ fontWeight: 800 }}>{u.username}</div>
                  {u.biography && <div style={{ opacity: 0.8, fontSize: 13 }}>{u.biography}</div>}
                </td>
                <td style={{ padding: 10, color: "#e8dcc8" }}>{u.email}</td>
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
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => openEdit(u)} style={{ padding: "8px 10px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                    Modifier
                  </button>
                  <button onClick={() => onDelete(u.id)} style={{ padding: "8px 10px", borderRadius: 10, backgroundColor: "#8b5a2b", color: "#e8dcc8", border: "1px solid #b87333" }}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, opacity: 0.8 }}>
                  Aucun utilisateur.
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
              {mode === "create" ? "Créer un utilisateur" : "Modifier l’utilisateur"}
            </h2>

            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="Username"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <input
                value={form.role ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="Rôle (admin/editor/user)"
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder={mode === "create" ? "Mot de passe (obligatoire)" : "Mot de passe (optionnel)"}
                style={{ padding: 10, borderRadius: 10, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
                type="password"
              />

              <input
                value={form.avatar_url ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, avatar_url: e.target.value }))}
                placeholder="Avatar URL (optionnel)"
                style={{ padding: 10, borderRadius: 10, gridColumn: "1 / -1", backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
              />

              <textarea
                value={form.biography ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, biography: e.target.value }))}
                placeholder="Biographie (optionnel)"
                style={{ padding: 10, borderRadius: 10, gridColumn: "1 / -1", minHeight: 90, backgroundColor: "rgba(26,20,16,.8)", color: "#e8dcc8", border: "1px solid rgba(184, 115, 51, 0.3)" }}
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