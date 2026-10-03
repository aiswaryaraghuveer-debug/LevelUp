import React, { useEffect } from "react";

function ConfirmOverlay({ title="Are you sure?", message, confirmLabel="Reset", onConfirm, onClose, danger=false }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-title">
          <h2 id="confirm-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmOverlay;
