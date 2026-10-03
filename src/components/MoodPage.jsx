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
  const entries = useMemo(() => [...(initialState.settings.moodEntries || [])].sort((a, b) => b.date.localeCompare(a.date)), [initialState.settings.moodEntries]);

  function saveMood(event) {
    event.preventDefault();
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, mood, note: note.trim() };
    onChange({ moodEntries: [entry, ...(initialState.settings.moodEntries || [])] });
    setNote("");
  }
  return (
    <section className="page tracker-page">
      <div className="page-heading"><div><h1>Mood Tracker</h1><p>Check in with yourself and notice patterns over time.</p></div></div>
      <div className="tracker-grid">
        <form className="card tracker-form" onSubmit={saveMood}>
          <h2>Daily check-in</h2>
          <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <div className="form-group"><span className="form-label">How are you feeling?</span><div className="mood-options">{moods.map((item) => <button key={item.value} type="button" className={`mood-option ${mood === item.value ? "selected" : ""}`} onClick={() => setMood(item.value)}><span>{item.icon}</span>{item.label}</button>)}</div></div>
          <label className="form-group"><span className="form-label">Note (optional)</span><textarea className="input tracker-textarea" rows="5" placeholder="What is influencing your mood?" value={note} onChange={(e) => setNote(e.target.value)} /></label>
          <button className="btn btn-primary" type="submit">Save mood</button>
        </form>
        <div className="card tracker-list"><h2>Mood history</h2>{entries.length === 0 ? <p className="tracker-empty">No mood check-ins yet.</p> : entries.map((entry) => {
          const selected = moods.find((item) => item.value === entry.mood) || moods[2];
          return <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>{selected.icon} {selected.label}</strong><span>{entry.date}</span></div></div>{entry.note && <p>{entry.note}</p>}</article>;
        })}</div>
      </div>
    </section>
  );
}
export default MoodPage;
