
import { useEffect, useRef, useState } from "react";
import "./admin.css";

type Msg = {
  id: string;
  text: string;
  from: "me" | "system";
  at: number;
};

export default function TelegraphChat() {
  const [online, setOnline] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setOnline(true);
      setMsgs((m) => [
        ...m,
        { id: crypto.randomUUID(), text: "Connexion établie (mode test).", from: "system", at: Date.now() },
      ]);
    }, 700);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    setMsgs((m) => [...m, { id: crypto.randomUUID(), text: clean, from: "me", at: Date.now() }]);
    setText("");

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: crypto.randomUUID(), text: `>> Reçu: ${clean}`, from: "system", at: Date.now() },
      ]);
    }, 500);
  };

  return (
    <div className="chatBox">
      <div className="chatHead">
        <div>
          <h3>Télégraphe</h3>
          <p className="muted">Mode test (sans WebSocket)</p>
        </div>
        <div className={`status ${online ? "on" : "off"}`}>
          {online ? "En ligne" : "Hors ligne"}
        </div>
      </div>

      <div className="chatBody">
        {msgs.map((m) => (
          <div key={m.id} className={`bubble ${m.from === "me" ? "me" : "sv"}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="chatForm" onSubmit={send}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={online ? "Écrire..." : "Connexion..."}
          disabled={!online}
        />
        <button className="admBtn" type="submit" disabled={!online}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
