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

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

export default function AdminTelegraphePage() {
  const [connected, setConnected] = useState(true);
  const [transport, setTransport] = useState<"WebSocket" | "Long Polling">("WebSocket");

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ user_id?: number; username: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = useMemo(() => {
    const users = onlineUsers.map(u => ({ name: u.username, role: 'ADMIN' as Role }));
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [query, onlineUsers]);

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
    let base = 'ws://89.168.38.93'; // direct WS to backend
    if (API_BASE_URL) {
      // if API_BASE_URL set, use it for WS
      base = API_BASE_URL.replace(/^https?/, 'ws');
    }

    const wsProto = base.startsWith('wss') ? 'wss' : 'ws';
    const host = base.replace(/^wss?:\/\//, '').replace(/\/$/, '');
    return `${wsProto}://${host}/chat/ws?client_id=${encodeURIComponent(clientId)}&username=${encodeURIComponent(username)}`;
  }

  async function fetchOnlineUsers() {
    try {
      const base = 'http://89.168.38.93'; 
      const res = await fetch(`${base}/chat/users`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.online_users)) setOnlineUsers(data.online_users);
      else if (Array.isArray(data)) setOnlineUsers(data as any);
    } catch (e) {
    }
  }

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
        console.log('WS connected');
        setWsConnected(true);
        // announce presence
        try { ws.send(JSON.stringify({ type: 'join' })); } catch {}
        fetchOnlineUsers();
      };

      ws.onmessage = (ev) => {
        console.log('WS message:', ev.data);
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'message') {
            const isMe = data.user_id === Number(localStorage.getItem('cev_auth_user') ? JSON.parse(String(localStorage.getItem('cev_auth_user'))).id : 0);
            if (isMe) return; // skip own messages received back
            setMessages((p) => [...p, {
              id: uid(), sender: isMe ? 'me' : 'other',
              author: data.username || 'Anonyme',
              role: undefined,
              content: data.message || data.text || JSON.stringify(data),
              time: new Date(data.timestamp || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            }] );
          } else if (data.type === 'user_joined' || data.type === 'user_left') {
            fetchOnlineUsers();
            const sysMsg: ChatMessage = {
              id: uid(), sender: 'system', author: 'Système', content: `${data.username} ${data.type === 'user_joined' ? "s'est connecté" : "s'est déconnecté"}`,
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((p) => [...p, sysMsg]);
          }
        } catch (e) {
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
      role: "ADMIN", // assuming admin
      content: text,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, msg]);
    setDraft("");
    // send via websocket if available
    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Sending WS message:', text);
        ws.send(text);
      } else {
        console.log('WS not open, readyState:', ws ? ws.readyState : 'no ws');
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
                Messages instantanés • réservé • {wsConnected ? "connecté" : connected ? "actif" : "pause"}
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
                  {connected ? "Instantané" : "Hors ligne — brouillon"}
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
