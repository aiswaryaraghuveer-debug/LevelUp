import React from "react"
import { calculateLevel, getLevelTitle, MAX_LEVEL, MAX_XP, XP_PER_LEVEL } from "../utils/helperFunctions"

function XPBar({initialState}){
    const xp = Math.min(MAX_XP, initialState.profile.xp);
    const Level = calculateLevel(xp);
    const xpInLevel = xp === MAX_XP ? XP_PER_LEVEL : xp % XP_PER_LEVEL;
    const percentage = { width: `${Math.floor((xpInLevel / XP_PER_LEVEL) * 100)}%` };
    const firstVisibleLevel = Math.min(Level, MAX_LEVEL - 2);
    const visibleLevels = Array.from({ length: 3 }, (_, index) => firstVisibleLevel + index);

    return (
      <section className="card xp-progress-card">
        <div className="section-title">
            <h3>⭐ XP Progress</h3>
            <strong>{xp} XP</strong>
        </div>
        <div className="wide-progress">
            <div style={percentage}></div>
        </div>
        <div className="level-track" aria-label="Level progression">
            {visibleLevels.map((level) => (
                <div key={level} className={`level-step ${level === Level ? "current" : ""}`} aria-current={level === Level ? "step" : undefined}>
                    <span className="level-step-number">{level}</span>
                    <small className="level-step-title">{getLevelTitle(level)}</small>
                </div>
            ))}
        </div>
        <div className="level-labels">
            <span>{Level === MAX_LEVEL ? "MAX LEVEL" : `${xpInLevel} / ${XP_PER_LEVEL} XP to level ${Level + 1}`}</span>
        </div>
    </section>
    );
}   
export default XPBar;