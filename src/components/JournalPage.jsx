import React, { useMemo, useState } from "react";

function JournalPage({ initialState, onChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(true);
  const [openDates, setOpenDates] = useState(() => new Set([today]));

  const groupedEntries = useMemo(() => {
    const sorted = [...(initialState.settings.journalEntries || [])].sort((a, b) => {
      const dateOrder = b.date.localeCompare(a.date);
      if (dateOrder !== 0) return dateOrder;
      return String(b.createdAt || b.id || "").localeCompare(String(a.createdAt || a.id || ""));
    });
    return sorted.reduce((groups, entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
      return groups;
    }, {});
  }, [initialState.settings.journalEntries]);

  function saveEntry(event) {
    event.preventDefault();
    if (!content.trim()) return;
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date,
      title: title.trim() || "Daily Journal",
      content: content.trim(),
      important,
      createdAt: new Date().toISOString(),
    };
    onChange({ journalEntries: [entry, ...(initialState.settings.journalEntries || [])] });
    setTitle("");
    setContent("");
    setImportant(false);
  }

  function removeEntry(id) {
    onChange({ journalEntries: (initialState.settings.journalEntries || []).filter((entry) => entry.id !== id) });
  }

  function toggleImportant(id) {
    onChange({
      journalEntries: (initialState.settings.journalEntries || []).map((entry) =>
        entry.id === id ? { ...entry, important: !entry.important } : entry
      ),
    });
  }

  function toggleDate(date) {
    setOpenDates((previous) => {
      const next = new Set(previous);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  return (
    <section className="page tracker-page">
      <div className="page-heading"><div><h1>Daily Journal</h1><p>Capture what happened, what you learned, and what matters today.</p></div></div>
      <div className="tracker-grid tracker-layout">
        <div className="card tracker-form tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setFormOpen((value) => !value)} aria-expanded={formOpen}>
            <h2>New entry</h2><span className="tracker-card-icon">{formOpen ? "−" : "+"}</span>
          </button>
          {formOpen && <form className="tracker-form-body" onSubmit={saveEntry}>
            <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label className="form-group"><span className="form-label">Title</span><input className="input" placeholder="How was your day?" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label className="form-group"><span className="form-label">Journal</span><textarea className="input tracker-textarea" rows="9" placeholder="Write freely..." value={content} onChange={(e) => setContent(e.target.value)} /></label>
            <label className="journal-important-toggle"><input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} /><span>★ Mark as important</span></label>
            <button className="btn btn-primary" type="submit">Save entry</button>
          </form>}
        </div>
        <div className="card tracker-list tracker-collapsible">
          <button type="button" className="tracker-card-header" onClick={() => setLogsOpen((value) => !value)} aria-expanded={logsOpen}>
            <h2>Entries</h2><span className="tracker-card-icon">{logsOpen ? "⌃" : "⌄"}</span>
          </button>
          {logsOpen && (
            <>
              {Object.keys(groupedEntries).length === 0 ? <p className="tracker-empty">No journal entries yet.</p> : Object.keys(groupedEntries).map((date) => {
                const isOpen = openDates.has(date);
                const importantCount = groupedEntries[date].filter((entry) => entry.important).length;
                return <div className={`tracker-date-group ${isOpen ? "open" : "collapsed"}`} key={date}>
                  <button type="button" className="tracker-date-heading" onClick={() => toggleDate(date)} aria-expanded={isOpen}>
                    <span><span className="date-chevron">{isOpen ? "⌄" : "›"}</span>{date}</span>
                    <span>{groupedEntries[date].length} {groupedEntries[date].length === 1 ? "entry" : "entries"}{importantCount ? ` · ★ ${importantCount} important` : ""}</span>
                  </button>
                  {isOpen && groupedEntries[date].map((entry) => (
                    <article className={`tracker-item ${entry.important ? "journal-important" : ""}`} key={entry.id}>
                      <div className="tracker-item-head">
                        <div><strong>{entry.important ? "★ " : ""}{entry.title}</strong><span>Added {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier"}</span></div>
                        <div className="tracker-item-actions">
                          <button type="button" className={`btn btn-secondary journal-star-button ${entry.important ? "important-active" : ""}`} onClick={() => toggleImportant(entry.id)} aria-label={entry.important ? "Remove important flag" : "Mark as important"} title={entry.important ? "Remove important flag" : "Mark as important"}>{entry.important ? "★" : "☆"}</button>
                          <button type="button" className="btn btn-secondary tracker-delete" onClick={() => removeEntry(entry.id)}>Delete</button>
                        </div>
                      </div>
                      <p>{entry.content}</p>
                    </article>
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
export default JournalPage;
