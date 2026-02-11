import { useMemo, useState } from "react";
import "../admin/pagestyle/calendar.css";

type ViewMode = "week" | "month";

type ShiftNoteCreate = {
  order_id: number;
  date: string; // YYYY-MM-DD
  content: string;
  shift_type: string;
};

type ShiftNoteOut = ShiftNoteCreate; 

const seedNotes: ShiftNoteOut[] = [
  { order_id: 101, date: "2026-03-01", shift_type: "jour", content: "Contrôle stock + préparation expédition." },
  { order_id: 102, date: "2026-03-02", shift_type: "nuit", content: "Alerte: rupture bientôt sur Bouclier." },
  { order_id: 103, date: "2026-03-03", shift_type: "urgent", content: "Incident livraison → contacter transporteur." },
  { order_id: 101, date: "2026-03-03", shift_type: "jour", content: "Vérif facture + suivi transporteur." },
];

const emptyCreate: ShiftNoteCreate = {
  order_id: 1,
  date: new Date().toISOString().slice(0, 10),
  content: "",
  shift_type: "jour",
};

export default function CalendarPageStatic() {
  //  pas de loading API
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<ShiftNoteOut[]>(seedNotes);

  const [mode, setMode] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());

  // modal create
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState<ShiftNoteCreate>(emptyCreate);
  const [creating, setCreating] = useState(false);

  // range
  const days = useMemo(() => {
    return mode === "week" ? getWeekGridDays(anchor) : getMonthGridDays(anchor);
  }, [mode, anchor]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ShiftNoteOut[]>();
    for (const n of notes) {
      const d = String(n.date);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(n);
    }
    return map;
  }, [notes]);

  // sidebar 
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const selectedItems = useMemo(() => itemsByDate.get(selectedDate) ?? [], [itemsByDate, selectedDate]);

  const monthLabel = useMemo(() => {
    return anchor.toLocaleString("fr-FR", { month: "long", year: "numeric" });
  }, [anchor]);

  const stats = useMemo(() => {
    const total = notes.length;
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCount = (itemsByDate.get(todayKey) ?? []).length;

    const byShift = new Map<string, number>();
    for (const n of notes) {
      const t = String(n.shift_type ?? "autre");
      byShift.set(t, (byShift.get(t) ?? 0) + 1);
    }

    const topShift = Array.from(byShift.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
    return { total, todayCount, topShift };
  }, [notes, itemsByDate]);

  async function submitCreate() {
    try {
      setError(null);
      setCreating(true);

      const payload: ShiftNoteCreate = {
        order_id: Number(createForm.order_id),
        date: createForm.date,
        shift_type: createForm.shift_type?.trim() || "jour",
        content: createForm.content?.trim() || "",
      };

      if (!payload.date) {
        setError("Date obligatoire.");
        return;
      }
      if (!payload.shift_type.trim()) {
        setError("Shift obligatoire.");
        return;
      }
      if (!payload.content.trim()) {
        setError("Contenu obligatoire.");
        return;
      }

      setNotes((prev) => [payload, ...prev]);

      setOpenCreate(false);
      setCreateForm({ ...emptyCreate, date: payload.date });
      setSelectedDate(payload.date);
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="adminPage">
      <div className="calTopBar">
        <div className="calTitleChip">
          <div className="calTitleMonth">{monthLabel}</div>
          <div className="calTiny">Admin Calendar (statique)</div>
        </div>

        <div className="calViewSwitch">
          <button className={`calBtn ${mode === "week" ? "isActive" : ""}`} onClick={() => setMode("week")}>
            semaines
          </button>
          <button className={`calBtn ${mode === "month" ? "isActive" : ""}`} onClick={() => setMode("month")}>
            mois
          </button>
        </div>

        <div className="calNav">
          <button className="calBtn ghost" onClick={() => setAnchor(addDays(anchor, mode === "week" ? -7 : -30))}>
            ←
          </button>
          <button className="calBtn" onClick={() => setAnchor(new Date())}>
            Aujourd&apos;hui
          </button>
          <button className="calBtn ghost" onClick={() => setAnchor(addDays(anchor, mode === "week" ? 7 : 30))}>
            →
          </button>

          <button
            className="calBtn primary"
            onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              setCreateForm((p) => ({ ...p, date: today }));
              setOpenCreate(true);
            }}
          >
            + Ajouter un note
          </button>
        </div>
      </div>

      {error && <div className="calError">{error}</div>}

      <div className="calLayout">
        <div className="calBoardWrap">
          <div className="calWeekHead">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((x) => (
              <div key={x} className="calWeekDay">
                {x}
              </div>
            ))}
          </div>

          <div className="calGrid">
            {days.map((d) => {
              const key = d.toISOString().slice(0, 10);
              const inMonth = d.getMonth() === anchor.getMonth();
              const list = itemsByDate.get(key) ?? [];
              const isSelected = key === selectedDate;

              return (
                <button
                  key={key}
                  type="button"
                  className={`calCell ${inMonth ? "" : "muted"} ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedDate(key)}
                >
                  <div className="calCellTop">
                    <span className="calDayNum">{d.getDate()}</span>
                    {list.length > 0 && <span className="calCount">{list.length}</span>}
                  </div>

                  <div className="calCellBody">
                    {list.slice(0, 2).map((n, idx) => (
                      <div key={idx} className={`calChip ${chipClass(n.shift_type)}`}>
                        <span className="calChipTitle">{n.shift_type}</span>
                        <span className="calChipSub">Order {n.order_id}</span>
                      </div>
                    ))}
                    {list.length > 2 && <div className="calMore">+{list.length - 2} more</div>}
                    {list.length === 0 && <div className="calEmptyMini">—</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="calSide">
          <div className="calSideCard">
            <div className="calSideTitle">Selected day</div>
            <div className="calSideDate">{selectedDate}</div>

            <div className="calSideStats">
              <div className="stat">
                <div className="statNum">{stats.total}</div>
                <div className="statLabel">Total notes</div>
              </div>
              <div className="stat">
                <div className="statNum">{stats.todayCount}</div>
                <div className="statLabel">Aujourd&apos;hui</div>
              </div>
              <div className="stat">
                <div className="statNum">{stats.topShift}</div>
                <div className="statLabel">Top shift</div>
              </div>
            </div>

            <button
              className="calBtn w100"
              onClick={() => {
                setCreateForm((p) => ({ ...p, date: selectedDate }));
                setOpenCreate(true);
              }}
            >
              +Ajouter note à {selectedDate}
            </button>
          </div>

          <div className="calSideCard">
            <div className="calSideTitle">Notes</div>

            {selectedItems.length === 0 ? (
              <div className="calSideEmpty">Aucune note sur ce jour.</div>
            ) : (
              <div className="calSideList">
                {selectedItems.map((n, idx) => (
                  <div key={idx} className="calSideEvent">
                    <div className="calSideEventTop">
                      <span className={`pill ${chipClass(n.shift_type)}`}>{n.shift_type}</span>
                      <span className="small">Order {n.order_id}</span>
                    </div>
                    <div className="calSideEventText">{n.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="calSideCard">
            <div className="calSideTitle">Legend</div>
            <div className="legend">
              <div>
                <span className="dot dot1" /> jour
              </div>
              <div>
                <span className="dot dot2" /> nuit
              </div>
              <div>
                <span className="dot dot3" /> urgent
              </div>
            </div>
          </div>
        </aside>
      </div>

      {openCreate && (
        <div className="calModalOverlay" onClick={() => setOpenCreate(false)}>
          <div className="calModal" onClick={(e) => e.stopPropagation()}>
            <div className="calModalHead">
              <h2>Créer une note</h2>
              <button className="calBtn ghost" onClick={() => setOpenCreate(false)}>
                ✕
              </button>
            </div>

            <div className="calForm">
              <label>
                Date
                <input
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm((p) => ({ ...p, date: e.target.value }))}
                />
              </label>

              <label>
                Shift
                <input
                  value={createForm.shift_type}
                  onChange={(e) => setCreateForm((p) => ({ ...p, shift_type: e.target.value }))}
                  placeholder="jour / nuit / urgent"
                />
              </label>

              <label>
                Order ID
                <input
                  type="number"
                  value={createForm.order_id}
                  onChange={(e) => setCreateForm((p) => ({ ...p, order_id: Number(e.target.value) }))}
                />
              </label>

              <label className="full">
                Contenu
                <textarea
                  value={createForm.content}
                  onChange={(e) => setCreateForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Note de quart…"
                />
              </label>
            </div>

            <div className="calModalActions">
              <button className="calBtn ghost" onClick={() => setOpenCreate(false)}>
                Annuler
              </button>
              <button className="calBtn primary" onClick={submitCreate} disabled={creating}>
                {creating ? "Création…" : "Créer"}
              </button>
            </div>

            <div className="calModalHint">(Version statique : ajout local uniquement.)</div>
          </div>
        </div>
      )}
    </section>
  );
}

function chipClass(shiftType: any) {
  const t = String(shiftType || "").toLowerCase();
  if (t.includes("nuit")) return "type2";
  if (t.includes("urgent") || t.includes("alerte") || t.includes("crit")) return "type3";
  return "type1";
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

// grid week
function getWeekGridDays(anchor: Date) {
  const d = new Date(anchor);
  const day = d.getDay(); 
  const diffToMonday = (day + 6) % 7;
  const monday = addDays(d, -diffToMonday);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// month grid
function getMonthGridDays(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const day = first.getDay();
  const diffToMonday = (day + 6) % 7;
  const gridStart = addDays(first, -diffToMonday);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}