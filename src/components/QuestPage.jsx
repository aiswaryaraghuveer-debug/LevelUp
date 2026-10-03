import React, { useState } from "react"
import AddNewQuestOverlay from "./AddNewQuestOverlay";
import { getGoalTarget, getLocalDateKey, getQuestXPDistribution } from "../utils/helperFunctions.js";
function QuestPage({ initialState, AddQuest, onToggleQuest, onDeleteQuest, onEditQuest }) {
    const [isQuestEditorOpen, setIsQuestEditorOpen] = useState(false);
    const [questToEdit, setQuestToEdit] = useState(null);
    const [category, setCategory] = useState("All");
    const [searchItem, setSearchItem] = useState("");
    const normalizedSearch = searchItem.trim().toLowerCase();
    const quests = initialState.quests.filter((quest) => {
        const matchesCategory = category === "All" || quest.category === category;
        const matchesSearch = quest.title.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
    });
    const today = getLocalDateKey();
    const dailyXP = getGoalTarget(initialState.goals, initialState.profile.xp).dailyXP;
    const questRewards = new Map(getQuestXPDistribution(initialState.quests, dailyXP).map((reward) => [reward.id, reward.xp]));

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
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Quests</h1>
                        <p>Turn your real-world goals into XP.</p>
                    </div>
                    <button className="btn btn-primary" onClick={openAddQuest}>＋ Add Quest</button>
                </div>
                <div className="toolbar">
                    <input className="input" placeholder="Search quests..." value={searchItem} onChange={(event) => setSearchItem(event.target.value)}/>
                    <select className="select" aria-label="Filter quests by category" value={category} onChange={(event) => setCategory(event.target.value)}>
                        <option>All</option>
                        <option>Health</option>
                        <option>Learning</option>
                        <option>Fitness</option>
                        <option>Personal</option>
                        <option>Productivity</option>
                    </select>
                </div>
                <div className="card quest-list">
                    {quests.length === 0 ? (
                        <p>No quests match your search or category.</p>
                    ) : quests.map((quest) => (
                        <div key={quest.id}>
                            <div className={`quest ${quest.completed ? 'completed' : ''}`}>
                                <button className="quest-checkbox" aria-label={`Toggle ${quest.title}`} aria-pressed={quest.completed} onClick={() => onToggleQuest(quest.id)}>{quest.completed && <span aria-hidden="true">✓</span>}</button>
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
                </div>
            </section>
            {
                isQuestEditorOpen && (
                    <AddNewQuestOverlay
                        onClose={() => setIsQuestEditorOpen(false)}
                        onAddQuest={saveQuest}
                        onEditQuest={saveQuest}
                        dailyXP={dailyXP}
                        quests={initialState.quests}
                        questToEdit={questToEdit} />
                )}
        </>
    )
}
export default QuestPage;