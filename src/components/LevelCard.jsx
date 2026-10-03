import React from "react";
import { calculateLevel, getLevelTitle, MAX_XP, XP_PER_LEVEL } from "../utils/helperFunctions"
function LevelCard ({initialState}) {
    const xp = Math.min(MAX_XP, initialState.profile.xp);
    const Level = calculateLevel(xp);
    const xpInLevel = xp === MAX_XP ? XP_PER_LEVEL : xp % XP_PER_LEVEL;
    const percentage = { width: `${Math.floor((xpInLevel / XP_PER_LEVEL) * 100)}%` };

    return (
        <>
            <section className="card xp-card">
                <div className="level-card-visual">
                    <div className="level-badge">
                        ♛
                    </div>
                    <div className="level-copy">
                    <div className="level-number">
                            Level {Level}
                        </div>
                        <div className="level-title">
                            {getLevelTitle(Level)}
                        </div>
                     </div>
                     <div className="mountains">
                        ⌁⌁⌁
                    </div>
                </div>
                <div className="xp-label-row">
                    <span>{xpInLevel} / {XP_PER_LEVEL} XP</span>
                    <strong>{xp} total XP</strong>
                </div>
                <div className="xp-bar">
                    <div 
                    className="xp-progress" style={percentage}>
                    </div>
                </div>
            </section>
        </>
    )
}
export default LevelCard;