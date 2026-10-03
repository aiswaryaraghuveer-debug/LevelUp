import React from "react"
import { getLevelProgress, getLevelTitle, MAX_LEVEL, MAX_XP } from "../utils/helperFunctions"

function XPBar({initialState}){
    const xp = Math.min(MAX_XP, initialState.profile.xp);
    const { level, xpInLevel, xpForLevel } = getLevelProgress(xp);
    const percentage = { width: `${Math.floor((xpInLevel / xpForLevel) * 100)}%` };
    const firstVisibleLevel = Math.min(level, MAX_LEVEL - 2);
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
            {visibleLevels.map((visibleLevel) => (
                <div key={visibleLevel} className={`level-step ${visibleLevel === level ? "current" : ""}`} aria-current={visibleLevel === level ? "step" : undefined}>
                    <span className="level-step-number">{visibleLevel}</span>
                    <small className="level-step-title">{getLevelTitle(visibleLevel)}</small>
                </div>
            ))}
        </div>
        <div className="level-labels">
            <span>{level === MAX_LEVEL ? "MAX LEVEL" : `${xpInLevel} / ${xpForLevel} XP to level ${level + 1}`}</span>
        </div>
    </section>
    );
}   
export default XPBar;