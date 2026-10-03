import React, { useMemo } from "react";
import { calculateLevel } from "../utils/helperFunctions.js";

function AnalyticsPage({ initialState }) {
  const today = new Date();
  const todayKey = today.toISOString().slice(0,10);
  const history = initialState.activityHistory || [];
  const days = useMemo(() => Array.from({length:7}, (_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6-index));
    const key = d.toISOString().slice(0,10);
    const found = history.find((item) => item.date === key);
    return { date:key, label:d.toLocaleDateString([], {weekday:"short"}), xp:Number(found?.xp||0), quests:Number(found?.quests||0), focus:Number(found?.focusMinutes||0) };
  }), [history]);
  const weekXP = days.reduce((sum,d)=>sum+d.xp,0);
  const weekQuests = days.reduce((sum,d)=>sum+d.quests,0);
  const focus = days.reduce((sum,d)=>sum+d.focus,0);
  const maxXP = Math.max(1,...days.map(d=>d.xp));
  const todayRecord = history.find((item)=>item.date===todayKey);
  const completionRate = todayRecord?.quests ? Math.round((todayRecord.completedQuests || todayRecord.quests) / Math.max(1,todayRecord.totalQuests || todayRecord.quests) * 100) : 0;

  return <section className="page analytics-page">
    <div className="page-heading"><div><h1>Productivity Analytics</h1><p>See how consistently you are leveling up.</p></div></div>
    <div className="analytics-cards">
      <div className="card analytics-stat"><span>7-day XP</span><strong>{weekXP}</strong></div>
      <div className="card analytics-stat"><span>Quests completed</span><strong>{weekQuests}</strong></div>
      <div className="card analytics-stat"><span>Focus minutes</span><strong>{focus}</strong></div>
      <div className="card analytics-stat"><span>Current level</span><strong>{calculateLevel(initialState.profile.xp)}</strong></div>
    </div>
    <div className="card chart-card">
      <div className="section-title"><div><h2>XP — last 7 days</h2><p>Daily XP earned from quest completions.</p></div><strong>{weekXP} XP</strong></div>
      <div className="chart analytics-chart">{days.map((day)=><div className="bar-wrapper" key={day.date} title={`${day.date}: ${day.xp} XP`}><strong className="bar-value">{day.xp}</strong><div className="bar" style={{height:`${Math.max(3,(day.xp/maxXP)*220)}px`}} /><span>{day.label}</span></div>)}</div>
    </div>
    <div className="analytics-two-column">
      <div className="card">
        <div className="section-title"><div><h2>Quest consistency</h2><p>Today's completion rate</p></div><strong>{completionRate}%</strong></div>
        <div className="wide-progress"><div style={{width:`${completionRate}%`}} /></div>
      </div>
      <div className="card">
        <div className="section-title"><div><h2>Focus time</h2><p>Last 7 days</p></div><strong>{Math.floor(focus/60)}h {focus%60}m</strong></div>
        <p className="analytics-note">Keep building the habit. Small consistent sessions compound into large gains.</p>
      </div>
    </div>
  </section>;
}
export default AnalyticsPage;
