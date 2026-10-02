import React from "react";
function StreakCard({streakDays}){

    return (
        <section className="card streak-card">
            <div className="streak-title">🔥 {streakDays} Day Streak</div>
            <p>You're on fire! Keep it up!</p>
            <div className="streak-art">☀︎ ⛰︎</div>
        </section>
    )
}
export default StreakCard;