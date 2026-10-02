import React from "react"
function StatCard({mainDig,mainText,subText,icon}) {
    return (
        <section className="card stat-card ">
            <div className="stat-icon">{icon}</div>
            <div className="stat-value">{mainDig}</div>
            <div className="stat-label">{mainText}</div>
            <div className="stat-sub">{subText}</div>
            </section>
    );
}
export default StatCard;