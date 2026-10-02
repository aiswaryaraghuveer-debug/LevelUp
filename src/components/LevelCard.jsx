import React from "react";
import {calculateLevel,getTotalXP} from "../utils/helperFunctions"
function LevelCard ({initialState}) {
    const totalXp=100
    const Level=calculateLevel(initialState.profile.xp)
    const percentage={width:Math.floor((initialState.profile.xp/200)*100) +"%"}

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
                            {initialState.profile.title}
                        </div>
                     </div>
                     <div className="mountains">
                        ⌁⌁⌁
                    </div>
                </div>
                <div className="xp-label-row">
                    <span>{initialState.profile.xp} / 200 XP</span>
                    <strong>{totalXp} total</strong>
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