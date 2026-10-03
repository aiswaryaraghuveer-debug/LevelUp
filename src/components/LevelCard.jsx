import React from "react";
import { getLevelProgress, getLevelTitle, MAX_XP } from "../utils/helperFunctions"
function LevelCard ({initialState}) {
    const xp = Math.min(MAX_XP, initialState.profile.xp);
    const { level, xpInLevel, xpForLevel } = getLevelProgress(xp);
    const percentage = { width: `${Math.floor((xpInLevel / xpForLevel) * 100)}%` };

    return (
        <>
            <section className="card xp-card">
                <div className="level-card-visual">
                    <div className="level-badge">
                        ♛
                    </div>
                    <div className="level-copy">
                    <div className="level-number">
                            Level {level}
                        </div>
                        <div className="level-title">
                            {getLevelTitle(level)}
                        </div>
                     </div>
                     <div className="mountains">
                        ⌁⌁⌁
                    </div>
                </div>
                <div className="xp-label-row">
                    <span>{xpInLevel} / {xpForLevel} XP</span>
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