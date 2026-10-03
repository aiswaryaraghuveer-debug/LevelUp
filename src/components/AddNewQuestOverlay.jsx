import React,{useState} from "react";
import { DAILY_QUEST_XP_LIMIT, MAX_DAILY_QUEST_XP, MIN_DAILY_QUEST_XP } from "../utils/helperFunctions.js";
function AddNewQuestOverlay({ onClose, onAddQuest, quests }) {
    const closeOverlay = onClose;
    const [newQuestTitle,setNewQuestTitle]=useState("");
     const [newQuestCategory,setNewQuestCategory]=useState("Learning");
    const [newQuestXp,setNewQuestXp]=useState(MAX_DAILY_QUEST_XP);
    const totalDailyQuestXP = quests.reduce((total, quest) => total + quest.xp, 0);
    const remainingDailyQuestXP = DAILY_QUEST_XP_LIMIT - totalDailyQuestXP;
    const selectedQuestXP = remainingDailyQuestXP >= MAX_DAILY_QUEST_XP
      ? Number(newQuestXp)
      : MIN_DAILY_QUEST_XP;

    function addQuestToList(event) {
      event.preventDefault();
      if (!newQuestTitle.trim() || selectedQuestXP > remainingDailyQuestXP) return;

      onAddQuest({
        id: Date.now(),
        title: newQuestTitle.trim(),
        category: newQuestCategory,
        xp: selectedQuestXP,
        completed: false,
      });
      onClose();
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-title">
            <h2>Create a Quest</h2>
            <button className="icon-button" type="button" onClick={closeOverlay}>×</button>
          </div>
          <form onSubmit={addQuestToList}>
            <div className="form-group">
              <label className="form-label" htmlFor="quest-title">Quest title</label>
              <input id="quest-title" className="input" placeholder="e.g. Practice React for 30 minutes" value={newQuestTitle} onChange={(event) => setNewQuestTitle(event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quest-category">Category</label>
              <select id="quest-category" className="select" value={newQuestCategory} onChange={(event) => setNewQuestCategory(event.target.value)}>
                <option>Learning</option><option>Health</option><option>Fitness</option><option>Personal</option><option>Productivity</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quest-xp">XP reward</label>
              <select id="quest-xp" className="select" value={selectedQuestXP} disabled={remainingDailyQuestXP <= 0} onChange={(event) => setNewQuestXp(Number(event.target.value))}>
                <option value={MIN_DAILY_QUEST_XP}>1 XP</option>
                <option value={MAX_DAILY_QUEST_XP} disabled={remainingDailyQuestXP < MAX_DAILY_QUEST_XP}>2 XP</option>
              </select>
            </div>
            <p className="quest-xp-counter" role="status">
              Daily XP: <strong>{totalDailyQuestXP}/{DAILY_QUEST_XP_LIMIT}</strong>. Each daily quest awards 1-2 XP.
            </p>
            <button className="btn btn-primary full" type="submit" disabled={!newQuestTitle.trim() || remainingDailyQuestXP <= 0}>Create Quest</button>
          </form>
        </div>
      </div>
    )
}
export default AddNewQuestOverlay;