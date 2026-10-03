import React,{useState} from "react";
import { DAILY_QUEST_XP_LIMIT, MAX_DAILY_QUEST_XP, MIN_DAILY_QUEST_XP } from "../utils/helperFunctions.js";
function AddNewQuestOverlay({ onClose, onAddQuest, onEditQuest, quests, dailyXP, questToEdit = null }) {
    const closeOverlay = onClose;
    const [newQuestTitle,setNewQuestTitle]=useState(questToEdit?.title || "");
    const [newQuestCategory,setNewQuestCategory]=useState(questToEdit?.category || "Learning");
    const [newQuestXp,setNewQuestXp]=useState(questToEdit?.xp || MAX_DAILY_QUEST_XP);
    const totalQuestWeight = quests.reduce((total, quest) => total + quest.xp, 0);
    const remainingQuestWeight = DAILY_QUEST_XP_LIMIT - totalQuestWeight + (questToEdit?.xp || 0);
    const selectedQuestXP = remainingQuestWeight >= MAX_DAILY_QUEST_XP
      ? Number(newQuestXp)
      : MIN_DAILY_QUEST_XP;
    const displayedQuestWeight = questToEdit
      ? totalQuestWeight - questToEdit.xp + selectedQuestXP
      : totalQuestWeight;

    function saveQuest(event) {
      event.preventDefault();
      if (!newQuestTitle.trim() || selectedQuestXP > remainingQuestWeight) return;

      const quest = {
        ...(questToEdit || {}),
        id: questToEdit?.id ?? Date.now(),
        title: newQuestTitle.trim(),
        category: newQuestCategory,
        xp: selectedQuestXP,
        completed: questToEdit?.completed ?? false,
        completedOn: questToEdit?.completedOn ?? null,
        dailyXPReward: questToEdit?.dailyXPReward ?? 0,
      };

      if (questToEdit) onEditQuest(quest);
      else onAddQuest(quest);
      onClose();
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-title">
            <h2>{questToEdit ? "Edit Quest" : "Create a Quest"}</h2>
            <button className="icon-button" type="button" onClick={closeOverlay}>×</button>
          </div>
          <form onSubmit={saveQuest}>
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
              <label className="form-label" htmlFor="quest-xp">Quest XP weight</label>
              <select id="quest-xp" className="select" value={selectedQuestXP} disabled={remainingQuestWeight <= 0} onChange={(event) => setNewQuestXp(Number(event.target.value))}>
                <option value={MIN_DAILY_QUEST_XP}>1 weight</option>
                <option value={MAX_DAILY_QUEST_XP} disabled={remainingQuestWeight < MAX_DAILY_QUEST_XP}>2 weights</option>
              </select>
            </div>
            <p className="quest-xp-counter" role="status">
              Quest weights: <strong>{displayedQuestWeight}/{DAILY_QUEST_XP_LIMIT}</strong>. Complete all daily quests to earn today's {dailyXP} XP target.
            </p>
            <button className="btn btn-primary full" type="submit" disabled={!newQuestTitle.trim() || remainingQuestWeight <= 0}>{questToEdit ? "Save Changes" : "Create Quest"}</button>
          </form>
        </div>
      </div>
    )
}
export default AddNewQuestOverlay;