import React, { useMemo, useState } from "react";

const categories = ["Food", "Transport", "Shopping", "Bills", "Health", "Education", "Other"];

function ExpensePage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const entries = useMemo(() => [...(initialState.settings.expenses || [])].sort((a, b) => b.date.localeCompare(a.date)), [initialState.settings.expenses]);
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  function saveExpense(event) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, amount: value, category, description: description.trim() };
    onChange({ expenses: [entry, ...(initialState.settings.expenses || [])] });
    setAmount("");
    setDescription("");
  }
  function removeExpense(id) {
    onChange({ expenses: (initialState.settings.expenses || []).filter((entry) => entry.id !== id) });
  }
  return (
    <section className="page tracker-page">
      <div className="page-heading"><div><h1>Expense Tracker</h1><p>Keep a simple record of your spending.</p></div></div>
      <div className="tracker-summary"><div className="card summary-card"><span>Total recorded</span><strong>₹{total.toFixed(2)}</strong></div><div className="card summary-card"><span>Entries</span><strong>{entries.length}</strong></div></div>
      <div className="tracker-grid">
        <form className="card tracker-form" onSubmit={saveExpense}>
          <h2>Add expense</h2>
          <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="form-group"><span className="form-label">Amount</span><input className="input" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          <label className="form-group"><span className="form-label">Category</span><select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="form-group"><span className="form-label">Description</span><input className="input" placeholder="What was it for?" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <button className="btn btn-primary" type="submit">Add expense</button>
        </form>
        <div className="card tracker-list"><h2>Expenses</h2>{entries.length === 0 ? <p className="tracker-empty">No expenses recorded yet.</p> : entries.map((entry) => (
          <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>₹{Number(entry.amount).toFixed(2)} · {entry.category}</strong><span>{entry.date}</span></div><button className="btn btn-secondary tracker-delete" onClick={() => removeExpense(entry.id)}>Delete</button></div>{entry.description && <p>{entry.description}</p>}</article>
        ))}</div>
      </div>
    </section>
  );
}
export default ExpensePage;
