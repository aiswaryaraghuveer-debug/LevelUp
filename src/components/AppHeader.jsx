import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { calculateLevel, getGreeting, getLevelTitle } from "../utils/helperFunctions.js";
import { navItems, themeOptions } from "../../data/data.js";
import DataTransferControls from "./DataTransferControls.jsx";
import AvatarSvg from "./AvatarSvg.jsx";
function AppHeader({ initialState, onChangeTheme, onExportData, onExportExcel, onLogout, onToggleMenu, isMenuOpen }) {

    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const greeting = getGreeting(initialState);
    const level = calculateLevel(initialState.profile.xp);
    const currentTheme = initialState.settings.theme || "rift";
    const selectedAvatar = initialState.profile.avatar || "";
    const availableNavItems = useMemo(() => {
        const features = initialState.settings?.features || {};
        return navItems.filter((item) => !item.featureKey || features[item.featureKey]);
    }, [initialState.settings?.features]);

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        const pages = availableNavItems
            .filter((item) => item.label.toLowerCase().includes(query))
            .map((item) => ({ ...item, resultType: "page" }));

        const quests = (initialState.quests || [])
            .filter((quest) => `${quest.title} ${quest.category || ""}`.toLowerCase().includes(query))
            .slice(0, 5)
            .map((quest) => ({ label: quest.title, icon: "◎", path: "/quests", resultType: "quest" }));

        const habits = (initialState.habits || [])
            .filter((habit) => `${habit.name} ${habit.icon || ""}`.toLowerCase().includes(query))
            .slice(0, 5)
            .map((habit) => ({ label: habit.name, icon: habit.icon || "♧", path: "/quests", resultType: "habit" }));

        return [...pages, ...quests, ...habits].slice(0, 8);
    }, [availableNavItems, initialState.quests, initialState.habits, searchQuery]);

    const handleSearchSelect = (result) => {
        navigate(result.path);
        setSearchQuery("");
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Escape") {
            setSearchQuery("");
            return;
        }
        if (event.key === "Enter" && searchResults[0]) {
            handleSearchSelect(searchResults[0]);
        }
    };

    return (
        <header className="header">
            <div>
                <button className="icon-button mobile-menu-button" type="button" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMenuOpen} aria-controls="primary-navigation" onClick={onToggleMenu}>
                    <span aria-hidden="true">☰</span>
                </button>
                <div className="greeting">
                    <h1>
                        {/* <span className="sun">☀ </span> */}
                        {greeting}
                        <span className="heart" aria-hidden="true">
                            {selectedAvatar ? ` ${selectedAvatar}` : " ♥"}
                        </span>
                    </h1>
                </div>
                <p>
                    Level {level} · {getLevelTitle(level)}
                </p>

            </div>

            <div className="header-actions">
                <div className="command-wrap">
                    <span className="search-icon" aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        value={searchQuery}
                        placeholder="Search quests, habits, or commands..."
                        className="command-input"
                        aria-label="Search quests, habits, or commands"
                        autoComplete="off"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    {searchQuery.trim() && (
                        <div className="command-menu" role="listbox" aria-label="Search results">
                            {searchResults.length ? searchResults.map((result, index) => (
                                <button
                                    key={`${result.resultType}-${result.path}-${result.label}-${index}`}
                                    type="button"
                                    role="option"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSearchSelect(result)}
                                >
                                    <span aria-hidden="true">{result.icon}</span>
                                    {result.label}
                                </button>
                            )) : (
                                <div className="command-empty">No matching quests, habits, or pages.</div>
                            )}
                        </div>
                    )}
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
                    <AvatarSvg value={selectedAvatar} size={39} />
                </Link>
                <button className="icon-button" type="button" aria-label="Sign out" title="Sign out" onClick={onLogout}>↪</button>
            </div>


        </header>
    );
}
export default AppHeader;