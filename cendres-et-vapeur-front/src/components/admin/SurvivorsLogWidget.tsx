import { useEffect, useMemo, useState } from "react";
import "./admin.css";

type Log = {
  id: string;
  createdAt: string;
  action: string;
  actor?: string;
};

const ACTIONS = [
  "Produit modifié",
  "Utilisateur mis à jour",
  "Accès admin autorisé",
  "Tentative de connexion",
  "Stock mis à jour",
];

export default function SurvivorsLogWidget() {
  const [logs, setLogs] = useState<Log[]>(() => [
    { id: crypto.randomUUID(), createdAt: new Date().toISOString(), action: "Système démarré", actor: "system" },
  ]);

  const latest = useMemo(() => logs.slice(0, 12), [logs]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setLogs((prev) => [
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), action, actor: "admin" },
        ...prev,
      ]);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="logsBox">
      <div className="logsHead">
        <div>
          <h3>Journal des Survivants</h3>
          <p className="muted">Mode test (logs simulés)</p>
        </div>
        <button
          className="admBtn ghost"
          onClick={() =>
            setLogs((prev) => [
              { id: crypto.randomUUID(), createdAt: new Date().toISOString(), action: "Rafraîchissement manuel", actor: "admin" },
              ...prev,
            ])
          }
        >
          Rafraîchir
        </button>
      </div>

      <div className="logsBody">
        {latest.map((l) => (
          <div key={l.id} className="logRow">
            <div className="mono small">{new Date(l.createdAt).toLocaleString()}</div>
            <div className="logAction">{l.action}</div>
            {l.actor && <div className="mono small">{l.actor}</div>}
          </div>
        ))}

        {latest.length === 0 && <div className="empty">Aucun log.</div>}
      </div>
    </div>
  );
}
