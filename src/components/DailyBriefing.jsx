import React, { useEffect } from "react";
import { calculateLevel } from "../utils/helperFunctions.js";

function DailyBriefing({ state, mode, onClose }) {
  const quests = state.quests || [];
  const completed = quests.filter((quest) => quest.completed).length;
  const totalXP = quests.reduce((sum, quest) => sum + (quest.completed ? Number(quest.dailyXPReward || 0) : 0), 0);
  const isNight = mode === "night";

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay briefing-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal daily-briefing" role="dialog" aria-modal="true">
        <div className="briefing-eyebrow">{isNight ? "DAILY RESULT" : "GOOD MORNING"}</div>
        <h2>{isNight ? "Review your run." : `Good morning, ${state.profile.name || "Hunter"}.`}</h2>
        {isNight ? (
          <>
            <div className="briefing-score">{totalXP} XP</div>
            <p>You completed {completed}/{quests.length} missions today.</p>
            <div className="briefing-stars" aria-label={`${completed} of ${quests.length} quests completed`}>{[0,1,2,3,4].map((i) => <span key={i}>{i < Math.round((completed / Math.max(1, quests.length)) * 5) ? "★" : "☆"}</span>)}</div>
            <p className="briefing-streak">🔥 Current streak: {state.profile.streak} days</p>
          </>
        ) : (
          <>
            <div className="briefing-score">Level {calculateLevel(state.profile.xp)}</div>
            <p>Today's missions are ready. Complete all of them to maximize your daily XP.</p>
            <div className="briefing-missions">{quests.slice(0, 5).map((quest) => <div key={quest.id}><span>□</span><span>{quest.title}</span><strong>+{quest.xp} XP</strong></div>)}</div>
            <p className="briefing-streak">🔥 Streak: {state.profile.streak} days</p>
          </>
        )}
        <button className="btn btn-primary full" type="button" onClick={onClose}>{isNight ? "Finish Day" : "Start Today's Missions"}</button>
      </div>
    </div>
  );
}
export default DailyBriefing;
