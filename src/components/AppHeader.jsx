import React from "react";
import { initialState } from "../../data/data.js";
import { getGreeting } from "../utils/helperFunctions.js";
function AppHeader() {

    const greeting = getGreeting(initialState);
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
                <div className="avatar">{initialState.profile.name.split("")[0]}</div>
            </div>


        </header>
    );
}
export default AppHeader;