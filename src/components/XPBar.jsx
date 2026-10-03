import React from "react"
import {calculateLevel,getTotalXP} from "../utils/helperFunctions"

function XPBar({initialState}){
    const totalXp=100;
        const Level=calculateLevel(initialState.profile.xp)
const percentage={width:Math.floor((totalXp/(totalXp+500))*100) +"%"}

    return (
      <section className="card xp-progress-card">
        <div className="section-title">
            <h3>⭐ XP Progress</h3>
            <strong>{totalXp} XP</strong>
        </div>
        <div className="wide-progress">
            <div style={percentage}></div>
        </div>
      <div className="level-track">
            {Array.from({ length: Level + 2 }, (_, index) => {
                const level = index + 1;
                return (
                    <span key={level} className={level <= Level ? "current" : ""}>
                        {level}
                    </span>
                );
            })}
        </div>
        <div className="level-labels">
            <span>Beginner</span>
            <span>Next Level</span>
        </div>
    </section>
    );
}   
export default XPBar;