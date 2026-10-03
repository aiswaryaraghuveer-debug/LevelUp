import React, { useState } from "react";
import { Link } from "react-router-dom";
import { calculateLevel, getGreeting, getLevelTitle } from "../utils/helperFunctions.js";
import { themeOptions } from "../../data/data.js";
import DataTransferControls from "./DataTransferControls.jsx";
function AppHeader({ initialState, onChangeTheme, onExportData, onExportExcel }) {

    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const greeting = getGreeting(initialState);
    const level = calculateLevel(initialState.profile.xp);
    const currentTheme = initialState.settings.theme || "rift";
    return (
        <header className="header">
            <div>
                <div className="greeting">
                    <h1>
                        {/* <span className="sun">☀ </span> */}
                        {greeting}
                        <span className="heart"> ♥</span>
                    </h1>
                </div>
                <p>
                    Level {level} · {getLevelTitle(level)}
                </p>

            </div>

            <div className="header-actions">
                <div className="command-wrap">
                    <span className="search-icon">⌕</span>
                    <input placeholder="Search quests, habits, or commands..." className="command-input" ></input>
                </div>
                <DataTransferControls compact showImport={false} onExportData={onExportData} onExportExcel={onExportExcel} />
                <div className="theme-picker">
                    <button
                        className="icon-button theme-shortcut"
                        type="button"
                        title="Choose a theme"
                        aria-label="Theme options"
                        aria-haspopup="true"
                        aria-expanded={isThemeMenuOpen}
                        aria-controls="header-theme-menu"
                        onClick={() => setIsThemeMenuOpen((open) => !open)}
                    >
                        <span aria-hidden="true">◐</span>
                    </button>
                    {isThemeMenuOpen && (
                        <div className="theme-picker-menu" id="header-theme-menu" aria-label="Choose a theme">
                            {themeOptions.map((theme) => (
                                <button
                                    className="theme-picker-option"
                                    key={theme.value}
                                    type="button"
                                    aria-pressed={currentTheme === theme.value}
                                    onClick={() => {
                                        onChangeTheme(theme.value);
                                        setIsThemeMenuOpen(false);
                                    }}
                                >
                                    <span className="theme-swatch" style={{ backgroundColor: theme.color }} aria-hidden="true" />
                                    {theme.label}
                                    {currentTheme === theme.value && <span className="theme-option-check" aria-hidden="true">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <Link className="avatar" to="/settings#profile" aria-label="Open profile settings" title="Profile">
                    {initialState.profile.name.charAt(0)}
                </Link>
            </div>


        </header>
    );
}
export default AppHeader;