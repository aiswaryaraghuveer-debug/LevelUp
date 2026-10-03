import React, { useMemo, useState } from "react";

function CaloriePage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [meal, setMeal] = useState("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const entries = useMemo(() => [...(initialState.settings.calorieEntries || [])].sort((a, b) => b.date.localeCompare(a.date)), [initialState.settings.calorieEntries]);
  const total = entries.filter((entry) => entry.date === today).reduce((sum, entry) => sum + Number(entry.calories || 0), 0);

  function saveCalories(event) {
    event.preventDefault();
    const value = Number(calories);
    if (!food.trim() || !Number.isFinite(value) || value <= 0) return;
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, meal, food: food.trim(), calories: value };
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
      <div className="tracker-grid">
        <form className="card tracker-form" onSubmit={saveCalories}>
          <h2>Add food</h2>
          <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="form-group"><span className="form-label">Meal</span><select className="select" value={meal} onChange={(e) => setMeal(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></label>
          <label className="form-group"><span className="form-label">Food</span><input className="input" placeholder="Food or drink" value={food} onChange={(e) => setFood(e.target.value)} /></label>
          <label className="form-group"><span className="form-label">Calories (kcal)</span><input className="input" type="number" min="1" step="1" placeholder="e.g. 350" value={calories} onChange={(e) => setCalories(e.target.value)} /></label>
          <button className="btn btn-primary" type="submit">Add food</button>
        </form>
        <div className="card tracker-list"><h2>Food log</h2>{entries.length === 0 ? <p className="tracker-empty">No foods logged yet.</p> : entries.map((entry) => (
          <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>{entry.food} · {entry.calories} kcal</strong><span>{entry.date} · {entry.meal}</span></div><button className="btn btn-secondary tracker-delete" onClick={() => removeEntry(entry.id)}>Delete</button></div></article>
        ))}</div>
      </div>
    </section>
  );
}
export default CaloriePage;
