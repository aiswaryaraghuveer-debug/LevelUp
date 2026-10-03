import React from "react";
import { Link } from "react-router-dom";
import { getGreeting } from "../utils/helperFunctions.js";
import DataTransferControls from "./DataTransferControls.jsx";
function AppHeader({ initialState, onChangeTheme, onExportData }) {

    const greeting = getGreeting(initialState);
    const currentTheme = initialState.settings.theme || "rose";
    const nextTheme = {
        rose: "ocean",
        ocean: "forest",
        forest: "rose",
    }[currentTheme] || "rose";
    return (
        <header className="header">
            <div>
                <div className="greeting">
                    <h1>
                        <span className="sun">☀ </span>
                        {greeting}
                        <span className="heart"> ♥</span>
                    </h1>
                </div>
                <p>
                    Another day, another level! Keep going!
                </p>

            </div>

            <div className="header-actions">
                <div className="command-wrap">
                    <span className="search-icon">⌕</span>
                    <input placeholder="Search quests, habits, or commands..." className="command-input" ></input>
                </div>
                <DataTransferControls compact showImport={false} onExportData={onExportData} />
                <button
                    className="icon-button theme-shortcut"
                    type="button"
                    title={`Switch to ${nextTheme} theme`}
                    aria-label={`Switch to ${nextTheme} theme`}
                    onClick={() => onChangeTheme(nextTheme)}
                >
                    <span aria-hidden="true">◐</span>
                </button>
                <Link className="avatar" to="/settings#profile" aria-label="Open profile settings" title="Profile">
                    {initialState.profile.name.charAt(0)}
                </Link>
            </div>


        </header>
    );
}
export default AppHeader;