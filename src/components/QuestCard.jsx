import React, { useState } from "react";
import AddNewQuestOverlay from "./AddNewQuestOverlay";
import { getGoalTarget, getLocalDateKey, getQuestXPDistribution } from "../utils/helperFunctions.js";
function QuestCard({ initialState,onToggleQuest ,AddQuest,onDeleteQuest,onEditQuest}) {
     const quests = initialState.quests;
    const today = getLocalDateKey();
    const dailyXP = getGoalTarget(initialState.goals, initialState.profile.xp).dailyXP;
    const questRewards = new Map(getQuestXPDistribution(quests, dailyXP).map((reward) => [reward.id, reward.xp]));
    const [isQuestEditorOpen, setIsQuestEditorOpen] = useState(false);
    const [questToEdit, setQuestToEdit] = useState(null);

    function changeQuestStatus(questId) {
        onToggleQuest(questId)
    }
    function openAddQuest() {
        setQuestToEdit(null);
        setIsQuestEditorOpen(true);
    }

    function openEditQuest(quest) {
        setQuestToEdit(quest);
        setIsQuestEditorOpen(true);
    }

    function saveQuest(quest) {
        if (questToEdit) onEditQuest(quest);
        else AddQuest(quest);
        setIsQuestEditorOpen(false);
        setQuestToEdit(null);
    }
    return (
        <>
         <section className="card quests-card">
            <div className="section-title">
                <div>
                    <h2>Today's Quest</h2>
                    <p>Complete your quests, earn XP and level up!</p>
                </div>
                <button className="btn btn-primary" onClick={openAddQuest}> + Add Quest</button>
               
            </div>

            {quests.map((quest) => (
                <div key={quest.id}>
                    <div className={`quest ${quest.completed ? 'completed' : ''}`}>
                        <button className="quest-checkbox" aria-label={`Toggle ${quest.title}`} aria-pressed={quest.completed} onClick={() => changeQuestStatus(quest.id)}>✔</button>
                        <div className="quest-info">
                            <div className="quest-title">
                                {quest.title}
                            </div>
                            <div className="quest-category">
                                {quest.category}
                            </div>
                        </div>
                        <span className="quest-xp">+ {quest.completedOn === today ? quest.dailyXPReward : questRewards.get(quest.id)} XP</span>
                        <div className="quest-actions">
                            <button className="edit-button" type="button" aria-label={`Edit ${quest.title}`} onClick={() => openEditQuest(quest)}>✎</button>
                            <button className="delete-button" type="button" aria-label={`Delete ${quest.title}`} onClick={() => onDeleteQuest(quest.id)}>×</button>
                        </div>

                    </div>

                </div>
            ))
            }
            </section>
               {isQuestEditorOpen && (
           <AddNewQuestOverlay
            onClose={() => setIsQuestEditorOpen(false)}
            onAddQuest={saveQuest}
            onEditQuest={saveQuest}
            dailyXP={dailyXP}
            quests={quests}
            questToEdit={questToEdit}/>
      )} 
        </>

    )
}
export default QuestCard;