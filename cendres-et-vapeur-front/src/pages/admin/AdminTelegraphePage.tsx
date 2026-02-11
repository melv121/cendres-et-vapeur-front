import { useEffect, useMemo, useRef, useState } from "react";
import "../admin/pagestyle/adminTelegraphe.css";

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

    //  réponse fake 
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
                <span className="memberChip">{u.role}</span>
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
