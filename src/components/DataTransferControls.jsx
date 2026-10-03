import React, { useRef } from "react";

function DataTransferControls({ compact = false, showImport = true, showExport = true, onImportFile, onExportData }) {
  const fileInput = useRef(null);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) onImportFile(file);
    event.target.value = "";
  }

  return (
    <div className={`data-transfer-controls${compact ? " compact" : ""}`}>
      {showImport && (
        <>
          <input
            ref={fileInput}
            className="data-transfer-input"
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            className={compact ? "icon-button data-transfer-icon" : "btn btn-secondary"}
            type="button"
            title="Import data from a JSON file"
            aria-label="Import data"
            onClick={() => fileInput.current?.click()}
          >
            {compact ? <span aria-hidden="true">↥</span> : "Import data"}
          </button>
        </>
      )}
      {showExport && (
        <button
          className={compact ? "icon-button data-transfer-icon" : "btn btn-secondary"}
          type="button"
          title="Export data as a JSON file"
          aria-label="Export data"
          onClick={onExportData}
        >
          {compact ? <span aria-hidden="true">↧</span> : "Export data"}
        </button>
      )}
    </div>
  );
}

export default DataTransferControls;
