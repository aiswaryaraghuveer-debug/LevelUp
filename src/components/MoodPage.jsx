import React, { useMemo, useState } from "react";

const moods = [
  { value: "great", label: "Great", icon: "😄" },
  { value: "good", label: "Good", icon: "🙂" },
  { value: "okay", label: "Okay", icon: "😐" },
  { value: "low", label: "Low", icon: "🙁" },
  { value: "rough", label: "Rough", icon: "😞" },
];

function MoodPage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [mood, setMood] = useState("good");
  const [note, setNote] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(true);
  const [openDates, setOpenDates] = useState(() => new Set());
  const groupedEntries = useMemo(() => {
    const sorted = [...(initialState.settings.moodEntries || [])].sort((a, b) => {
      const dateOrder = b.date.localeCompare(a.date);
      if (dateOrder !== 0) return dateOrder;
      return String(b.createdAt || b.id || "").localeCompare(String(a.createdAt || a.id || ""));
    });
    return sorted.reduce((groups, entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
      return groups;
    }, {});
  }, [initialState.settings.moodEntries]);

  function toggleDate(date) {
    setOpenDates((previous) => {
      const next = new Set(previous);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  function saveMood(event) {
    event.preventDefault();
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, mood, note: note.trim(), createdAt: new Date().toISOString() };
    onChange({ moodEntries: [entry, ...(initialState.settings.moodEntries || [])] });
    setNote("");
  }
  return (
    <section className="page tracker-page">
      <div className="page-heading"><div><h1>Mood Tracker</h1><p>Check in with yourself and notice patterns over time.</p></div></div>
      <div className="tracker-grid tracker-layout">
        <div className="card tracker-form tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setFormOpen((value) => !value)} aria-expanded={formOpen}>
            <h2>Daily check-in</h2><span className="tracker-card-icon">{formOpen ? "−" : "+"}</span>
          </button>
          {formOpen && <form className="tracker-form-body" onSubmit={saveMood}>
            <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <div className="form-group"><span className="form-label">How are you feeling?</span><div className="mood-options">{moods.map((item) => <button key={item.value} type="button" className={`mood-option ${mood === item.value ? "selected" : ""}`} onClick={() => setMood(item.value)}><span>{item.icon}</span>{item.label}</button>)}</div></div>
            <label className="form-group"><span className="form-label">Note (optional)</span><textarea className="input tracker-textarea" rows="5" placeholder="What is influencing your mood?" value={note} onChange={(e) => setNote(e.target.value)} /></label>
            <button className="btn btn-primary" type="submit">Save mood</button>
          </form>}
        </div>
        <div className="card tracker-list tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setLogsOpen((value) => !value)} aria-expanded={logsOpen}>
            <h2>Mood history</h2><span className="tracker-card-icon">{logsOpen ? "⌃" : "⌄"}</span>
          </button>
          {logsOpen && (
            <>
              {Object.keys(groupedEntries).length === 0 ? <p className="tracker-empty">No mood check-ins yet.</p> : Object.keys(groupedEntries).map((date, index) => {
                const isOpen = openDates.has(date) || (openDates.size === 0 && index === 0);
                return <div className={`tracker-date-group ${isOpen ? "open" : "collapsed"}`} key={date}>
                  <button type="button" className="tracker-date-heading" onClick={() => toggleDate(date)} aria-expanded={isOpen}>
                    <span><span className="date-chevron">{isOpen ? "⌄" : "›"}</span>{date}</span>
                    <span>{groupedEntries[date].length} {groupedEntries[date].length === 1 ? "entry" : "entries"}</span>
                  </button>
                  {isOpen && groupedEntries[date].map((entry) => {
                    const selected = moods.find((item) => item.value === entry.mood) || moods[2];
                    return <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>{selected.icon} {selected.label}</strong><span>Added {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier"}</span></div></div>{entry.note && <p>{entry.note}</p>}</article>;
                  })}
                </div>;
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export default MoodPage;
