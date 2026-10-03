import React, { useRef, useState } from "react";

function DataTransferControls({ compact = false, showImport = true, showExport = true, onImportFile, onExportData, onExportExcel }) {
  const fileInput = useRef(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

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
      {showExport && compact && (
        <>
          <button
            className="icon-button data-transfer-icon"
            type="button"
            title="Choose an export format"
            aria-label="Export options"
            aria-haspopup="true"
            aria-expanded={isExportMenuOpen}
            aria-controls="header-export-menu"
            onClick={() => setIsExportMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">↧</span>
          </button>
          {isExportMenuOpen && (
            <div className="data-export-menu" id="header-export-menu" aria-label="Export options">
              <button type="button" onClick={() => { setIsExportMenuOpen(false); onExportData(); }}>Export JSON</button>
              <button type="button" onClick={() => { setIsExportMenuOpen(false); onExportExcel(); }}>Export Excel</button>
            </div>
          )}
        </>
      )}
      {showExport && !compact && (
        <>
          <button className="btn btn-secondary" type="button" onClick={onExportData}>
            Export JSON
          </button>
          <button className="btn btn-secondary" type="button" onClick={onExportExcel}>
            Export Excel
          </button>
        </>
      )}
    </div>
  );
}

export default DataTransferControls;
