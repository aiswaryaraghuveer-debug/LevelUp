import React, { useMemo, useState } from "react";

function CaloriePage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [meal, setMeal] = useState("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(true);
  const [openDates, setOpenDates] = useState(() => new Set());
  const entries = useMemo(() => [...(initialState.settings.calorieEntries || [])].sort((a, b) => String(b.createdAt || b.id || "").localeCompare(String(a.createdAt || a.id || ""))), [initialState.settings.calorieEntries]);
  const groupedEntries = useMemo(() => {
    return entries.reduce((groups, entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
      return groups;
    }, {});
  }, [entries]);
  const orderedDates = useMemo(() => Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a)), [groupedEntries]);
  const total = entries.filter((entry) => entry.date === today).reduce((sum, entry) => sum + Number(entry.calories || 0), 0);

  function toggleDate(date) {
    setOpenDates((previous) => {
      const next = new Set(previous);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  function saveCalories(event) {
    event.preventDefault();
    const value = Number(calories);
    if (!food.trim() || !Number.isFinite(value) || value <= 0) return;
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, meal, food: food.trim(), calories: value, createdAt: new Date().toISOString() };
    onChange({ calorieEntries: [entry, ...(initialState.settings.calorieEntries || [])] });
    setFood("");
    setCalories("");
  }
  function removeEntry(id) {
    onChange({ calorieEntries: (initialState.settings.calorieEntries || []).filter((entry) => entry.id !== id) });
  }
  return (
    <section className="page tracker-page">
      <div className="page-heading"><div><h1>Calorie Tracker</h1><p>Log meals and keep an eye on your daily intake.</p></div></div>
      <div className="tracker-summary"><div className="card summary-card"><span>Today's calories</span><strong>{total} kcal</strong></div><div className="card summary-card"><span>Entries</span><strong>{entries.length}</strong></div></div>
      <div className="tracker-grid tracker-layout">
        <div className="card tracker-form tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setFormOpen((value) => !value)} aria-expanded={formOpen}>
            <h2>Add food</h2><span className="tracker-card-icon">{formOpen ? "−" : "+"}</span>
          </button>
          {formOpen && <form className="tracker-form-body" onSubmit={saveCalories}>
            <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label className="form-group"><span className="form-label">Meal</span><select className="select" value={meal} onChange={(e) => setMeal(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></label>
            <label className="form-group"><span className="form-label">Food</span><input className="input" placeholder="Food or drink" value={food} onChange={(e) => setFood(e.target.value)} /></label>
            <label className="form-group"><span className="form-label">Calories (kcal)</span><input className="input" type="number" min="1" step="1" placeholder="e.g. 350" value={calories} onChange={(e) => setCalories(e.target.value)} /></label>
            <button className="btn btn-primary" type="submit">Add food</button>
          </form>}
        </div>
        <div className="card tracker-list tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setLogsOpen((value) => !value)} aria-expanded={logsOpen}>
            <h2>Food log</h2><span className="tracker-card-icon">{logsOpen ? "⌃" : "⌄"}</span>
          </button>
          {logsOpen && (
            <>
              {orderedDates.length === 0 ? <p className="tracker-empty">No foods logged yet.</p> : orderedDates.map((date, index) => {
                const isOpen = openDates.has(date) || (openDates.size === 0 && index === 0);
                return <div className={`tracker-date-group ${isOpen ? "open" : "collapsed"}`} key={date}>
                  <button type="button" className="tracker-date-heading" onClick={() => toggleDate(date)} aria-expanded={isOpen}>
                    <span><span className="date-chevron">{isOpen ? "⌄" : "›"}</span>{date}</span>
                    <span>{groupedEntries[date].length} {groupedEntries[date].length === 1 ? "entry" : "entries"}</span>
                  </button>
                  {isOpen && groupedEntries[date].map((entry) => (
                    <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>{entry.food} · {entry.calories} kcal</strong><span>Added {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier"} · {entry.meal}</span></div><button type="button" className="btn btn-secondary tracker-delete" onClick={() => removeEntry(entry.id)}>Delete</button></div></article>
                  ))}
                </div>;
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}