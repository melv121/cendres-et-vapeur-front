import { useEffect, useMemo, useRef, useState } from "react";
import "./pagestyle/adminTelegraphe.css";
import { API_BASE_URL } from "../../api/api";

type Role = "ADMIN" | "EDITOR";
type Sender = "me" | "other" | "system";

type ChatMessage = {
  id: string;
  sender: Sender;
  author: string;
  role?: Role;
  content: string;
  time: string;
};

const seedUsers = [
  { name: "Valdr", role: "EDITOR" as Role },
  { name: "Shaima", role: "EDITOR" as Role },
  { name: "Nox", role: "ADMIN" as Role },
  { name: "Mouna", role: "EDITOR" as Role },
];

const seedMessages: ChatMessage[] = [
  {
    id: "sys-1",
    sender: "system",
    author: "Système",
    content: "Canal sécurisé — réservé aux Administrateurs & Éditeurs.",
    time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  },
  {
    id: "m-1",
    sender: "other",
    author: "Valdr",
    role: "EDITOR",
    content: "Restez discrets. Le télégraphe est ouvert.",
    time: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  },
  {
    id: "m-2",
    sender: "me",
    author: "Moi",
    role: "ADMIN",
    content: "Bien reçu. Je prépare les stats et le journal.",
    time: new Date(Date.now() - 1000 * 60 * 6).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  },
];

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

export default function AdminTelegraphePage() {
  const [connected, setConnected] = useState(true);
  const [transport, setTransport] = useState<"WebSocket" | "Long Polling">("WebSocket");

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [onlineUsers, setOnlineUsers] = useState<{ user_id?: number; username: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seedUsers;
    return seedUsers.filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [query]);

  // scroll 
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // build WS URL
  function getWsUrl() {
    const userStr = localStorage.getItem('cev_auth_user');
    let clientId = '0';
    let username = 'Guest';
    try {
      if (userStr) {
        const u = JSON.parse(userStr);
        clientId = String(u.id || u.user_id || 0);
        username = String(u.name || u.username || u.email || 'User');
      }
    } catch {}

    // prefer explicit env API_BASE_URL if set
    let base = API_BASE_URL || '';
    if (!base) {
      // fallback to same host on port 8000
      base = `${location.protocol === 'https:' ? 'https' : 'http'}://${location.hostname}:8000`;
    }

    const wsProto = base.startsWith('https') ? 'wss' : 'ws';
    const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `${wsProto}://${host}/chat/ws?client_id=${encodeURIComponent(clientId)}&username=${encodeURIComponent(username)}`;
  }

  async function fetchOnlineUsers() {
    try {
      const base = API_BASE_URL || `${location.protocol === 'https:' ? 'https' : 'http'}://${location.hostname}:8000`;
      const res = await fetch(`${base.replace(/\/$/, '')}/chat/users`);
      if (!res.ok) return;
      const data = await res.json();
      // expect { online_users: [...], count: n }
      if (Array.isArray(data.online_users)) setOnlineUsers(data.online_users);
      else if (Array.isArray(data)) setOnlineUsers(data as any);
    } catch (e) {
      // ignore
    }
  }

  // manage WS connection when transport is WebSocket and connected
  useEffect(() => {
    if (!connected || transport !== 'WebSocket') {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
        wsRef.current = null;
      }
      setWsConnected(false);
      return;
    }

    const url = getWsUrl();
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        // announce presence
        try { ws.send(JSON.stringify({ type: 'join' })); } catch {}
        fetchOnlineUsers();
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'message') {
            setMessages((p) => [...p, {
              id: uid(), sender: data.user_id === Number(localStorage.getItem('cev_auth_user') ? JSON.parse(String(localStorage.getItem('cev_auth_user'))).id : 0) ? 'me' : 'other',
              author: data.username || 'Anonyme',
              role: undefined,
              content: data.message || data.text || JSON.stringify(data),
              time: new Date(data.timestamp || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            }] );
          } else if (data.type === 'user_joined' || data.type === 'user_left') {
            // refresh list
            fetchOnlineUsers();
            const sysMsg: ChatMessage = {
              id: uid(), sender: 'system', author: 'Système', content: `${data.username} ${data.type === 'user_joined' ? "s'est connecté" : "s'est déconnecté"}`,
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((p) => [...p, sysMsg]);
          }
        } catch (e) {
          // if server sends plain text, push as message
          setMessages((p) => [...p, { id: uid(), sender: 'other', author: 'Serveur', content: String(ev.data), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
        }
      };

      ws.onclose = () => { setWsConnected(false); wsRef.current = null; };
      ws.onerror = () => { /* ignore for now */ };
    } catch (e) {
      setWsConnected(false);
      wsRef.current = null;
    }

    // cleanup
    return () => {
      if (wsRef.current) try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    };
  }, [connected, transport]);

  // keep online users refreshed periodically
  useEffect(() => {
    fetchOnlineUsers();
    const id = setInterval(fetchOnlineUsers, 15_000);
    return () => clearInterval(id);
  }, []);

  function toggleConnection() {
    setConnected((v) => !v);
    setTransport((t) => (t === "WebSocket" ? "Long Polling" : "WebSocket"));
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;

    const msg: ChatMessage = {
      id: uid(),
      sender: "me",
      author: "Moi",
      role: "EDITOR",
      content: text,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, msg]);
    setDraft("");
    // send via websocket if available
    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(text);
      } else {
        // fallback fake response for demo/offline
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              sender: "other",
              author: "Valdr",
              role: "EDITOR",
              content: "Reçu. Continue. 🕯️",
              time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }, 700);
      }
    } catch (e) {
      // ignore send errors
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="telePage">
      <div className="teleGrid">

        <aside className="teleSide">
          <div className="teleSideTop">
            <div className="teleSideTitle">
              <h1>Télégraphe</h1>
              <p>Chat interne — Admins & Éditeurs</p>
            </div>

            <button className="teleToggle" onClick={toggleConnection} aria-label="Changer l’état de connexion">
              {connected ? "En ligne" : "Hors ligne"}
            </button>
          </div>

          <div className="teleSearch">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher admin / éditeur…"
              aria-label="Rechercher un membre"
            />
          </div>

          <div className="teleMembers" role="list" aria-label="Liste des membres">
            {filteredUsers.map((u) => (
              <div className="memberRow" key={u.name} role="listitem">
                <span className={`dot ${u.role === "ADMIN" ? "gold" : "pink"}`} />
                <div className="memberInfo">
                  <div className="memberName">{u.name}</div>
                  <div className="memberRole">{u.role === "ADMIN" ? "Administrateur" : "Éditeur"}</div>
                </div>
                <span className={`memberChip ${u.role === "ADMIN" ? "admin" : "editor"}`}>{u.role}</span>
              </div>
            ))}
          </div>


        </aside>

        <main className="teleMain">
          <header className="teleHeader">
            <div className="teleHeaderLeft">
              <div className="roomTitle">télégraphe</div>
              <div className="roomSub">
                Messages instantanés • réservé • {connected ? "actif" : "pause"}
              </div>
            </div>

            <div className="teleHeaderRight">
              <span className={`pulse ${connected ? "on" : "off"}`} aria-label="Indicateur de connexion" />
              <span className="smallText">{connected ? "En ligne" : "Hors ligne"}</span>
            </div>
          </header>

          <div className="teleMessages" ref={listRef} aria-label="Zone des messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  "msg",
                  m.sender === "me" ? "me" : "",
                  m.sender === "system" ? "system" : "",
                ].join(" ")}
              >
                {m.sender === "system" ? (
                  <div className="sysBubble">
                    <span className="sysIcon">⛓️</span>
                    <span>{m.content}</span>
                  </div>
                ) : (
                  <div className="bubbleWrap">
                    <div className="meta">
                      <span className="author">{m.author}</span>
                      {m.role && <span className={`role ${m.role === "ADMIN" ? "admin" : "editor"}`}>{m.role}</span>}
                      <span className="time">{m.time}</span>
                    </div>
                    <div className="bubble">{m.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="teleComposer">
            <div className="composerBox">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Écrire un message… "
                aria-label="Écrire un message"
              />
              <div className="composerActions">
                <div className="composerNote">
                  {connected ? "Instantané (mock)" : "Hors ligne — brouillon"}
                </div>
                <button className="sendBtn" onClick={sendMessage} aria-label="Envoyer le message">
                  Envoyer
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
