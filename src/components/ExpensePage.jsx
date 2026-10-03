import React, { useMemo, useState } from "react";

const categories = ["Food", "Transport", "Shopping", "Bills", "Health", "Education", "Other"];

function ExpensePage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [income, setIncome] = useState(String(initialState.settings.expenseIncome || ""));
  const [goal, setGoal] = useState(String(initialState.settings.expenseGoal || ""));
  const [formOpen, setFormOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(true);
  const [openDates, setOpenDates] = useState(() => new Set());
  const entries = useMemo(() => [...(initialState.settings.expenses || [])].sort((a, b) => String(b.createdAt || b.id || "").localeCompare(String(a.createdAt || a.id || ""))), [initialState.settings.expenses]);
  const groupedEntries = useMemo(() => {
    return entries.reduce((groups, entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
      return groups;
    }, {});
  }, [entries]);
  const orderedDates = useMemo(() => Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a)), [groupedEntries]);
  const currentMonth = today.slice(0, 7);
  const monthlyEntries = entries.filter((entry) => String(entry.date || "").slice(0, 7) === currentMonth);
  const total = monthlyEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const monthlyIncome = Number(initialState.settings.expenseIncome || 0);
  const spendingGoal = Number(initialState.settings.expenseGoal || 0);
  const remaining = monthlyIncome - total;
  const goalRemaining = spendingGoal - total;
  const goalProgress = spendingGoal > 0 ? Math.min(100, (total / spendingGoal) * 100) : 0;

  function toggleDate(date) {
    setOpenDates((previous) => {
      const next = new Set(previous);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  function saveBudget(event) {
    event.preventDefault();
    const nextIncome = Number(income);
    const nextGoal = Number(goal);
    onChange({
      expenseIncome: Number.isFinite(nextIncome) && nextIncome >= 0 ? nextIncome : 0,
      expenseGoal: Number.isFinite(nextGoal) && nextGoal >= 0 ? nextGoal : 0,
    });
  }

  function saveExpense(event) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    const entry = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date, amount: value, category, description: description.trim(), createdAt: new Date().toISOString() };
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
      <div className="tracker-summary">
        <div className="card summary-card"><span>Income</span><strong>₹{monthlyIncome.toFixed(2)}</strong></div>
        <div className="card summary-card"><span>Spent</span><strong>₹{total.toFixed(2)}</strong></div>
        <div className="card summary-card"><span>Balance</span><strong className={remaining < 0 ? "budget-over" : ""}>₹{remaining.toFixed(2)}</strong></div>
        <div className="card summary-card"><span>This month</span><strong>{monthlyEntries.length}</strong></div>
      </div>
      <div className="card expense-budget-card">
        <div className="expense-budget-head"><div><h2>Monthly budget</h2><p>Set your income and the maximum you want to spend.</p></div><strong>₹{Math.max(0, goalRemaining).toFixed(2)} left</strong></div>
        <div className="budget-progress"><span style={{ width: `${goalProgress}%` }} /></div>
        {spendingGoal > 0 && <p className="budget-caption">₹{total.toFixed(2)} of ₹{spendingGoal.toFixed(2)} spent {goalRemaining < 0 ? "— goal exceeded" : ""}</p>}
      </div>
      <div className="tracker-grid tracker-layout">
        <div>
          <div className="card tracker-form tracker-collapsible">
            <button type="button" className="tracker-card-header" onClick={() => setBudgetOpen((value) => !value)} aria-expanded={budgetOpen}><h2>Income & goal</h2><span className="tracker-card-icon">{budgetOpen ? "−" : "+"}</span></button>
            {budgetOpen && <form className="tracker-form-body" onSubmit={saveBudget}>
              <label className="form-group"><span className="form-label">Monthly income</span><input className="input" type="number" min="0" step="0.01" placeholder="0.00" value={income} onChange={(e) => setIncome(e.target.value)} /></label>
              <label className="form-group"><span className="form-label">Monthly spending goal</span><input className="input" type="number" min="0" step="0.01" placeholder="0.00" value={goal} onChange={(e) => setGoal(e.target.value)} /></label>
              <button className="btn btn-secondary" type="submit">Save budget</button>
            </form>}
          </div>
          <div className="card tracker-form tracker-collapsible">
            <button type="button" className="tracker-card-header" onClick={() => setFormOpen((value) => !value)} aria-expanded={formOpen}><h2>Add expense</h2><span className="tracker-card-icon">{formOpen ? "−" : "+"}</span></button>
            {formOpen && <form className="tracker-form-body" onSubmit={saveExpense}>
              <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
              <label className="form-group"><span className="form-label">Amount</span><input className="input" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
              <label className="form-group"><span className="form-label">Category</span><select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="form-group"><span className="form-label">Description</span><input className="input" placeholder="What was it for?" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
              <button className="btn btn-primary" type="submit">Add expense</button>
            </form>}
          </div>
        </div>
        <div className="card tracker-list tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setLogsOpen((value) => !value)} aria-expanded={logsOpen}>
            <h2>Expenses</h2><span className="tracker-card-icon">{logsOpen ? "⌃" : "⌄"}</span>
          </button>
          {logsOpen && (
            <>
              {orderedDates.length === 0 ? <p className="tracker-empty">No expenses recorded yet.</p> : orderedDates.map((date, index) => {
                const isOpen = openDates.has(date) || (openDates.size === 0 && index === 0);
                return <div className={`tracker-date-group ${isOpen ? "open" : "collapsed"}`} key={date}>
                  <button type="button" className="tracker-date-heading" onClick={() => toggleDate(date)} aria-expanded={isOpen}>
                    <span><span className="date-chevron">{isOpen ? "⌄" : "›"}</span>{date}</span>
                    <span>{groupedEntries[date].length} {groupedEntries[date].length === 1 ? "entry" : "entries"}</span>
                  </button>
                  {isOpen && groupedEntries[date].map((entry) => (
                    <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>₹{Number(entry.amount).toFixed(2)} · {entry.category}</strong><span>Added {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) : "Earlier"}</span></div><button type="button" className="btn btn-secondary tracker-delete" onClick={() => removeExpense(entry.id)}>Delete</button></div>{entry.description && <p>{entry.description}</p>}</article>
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
export default ExpensePage;
