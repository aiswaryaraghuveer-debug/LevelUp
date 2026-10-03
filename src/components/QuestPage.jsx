import React, { useState } from "react"
import AddNewQuestOverlay from "./AddNewQuestOverlay";
function QuestPage({ initialState, AddQuest, onToggleQuest, onDeleteQuest }) {
    const [addNewQuest, setAddNewQuest] = useState(false);
    const [category, setCategory] = useState("All");
    const [searchItem, setSearchItem] = useState("");
    const normalizedSearch = searchItem.trim().toLowerCase();
    const quests = initialState.quests.filter((quest) => {
        const matchesCategory = category === "All" || quest.category === category;
        const matchesSearch = quest.title.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
    });

    function addNewReq(quest) {
        AddQuest(quest)
        setAddNewQuest(false)
    }
    return (
        <>
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Quests</h1>
                        <p>Turn your real-world goals into XP.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setAddNewQuest(true) }}>＋ Add Quest</button>
                </div>
                <div className="toolbar">
                    <input className="input" placeholder="Search quests..." value={searchItem} onChange={(event) => setSearchItem(event.target.value)}/>
                    <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
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
                                <button className="quest-checkbox" aria-label={`Toggle ${quest.title}`} aria-pressed={quest.completed} onClick={() => onToggleQuest(quest.id)}>✔</button>
                                <div className="quest-info">
                                    <div className="quest-title">
                                        {quest.title}
                                    </div>
                                    <div className="quest-category">
                                        {quest.category}
                                    </div>
                                </div>
                                <span className="quest-xp">+ {quest.xp} XP</span>
                                <button className="delete-button" aria-label={`Delete ${quest.title}`} onClick={() => onDeleteQuest(quest.id)}>×</button>
                            </div>

                        </div>
                    ))
                    }
                </div>
            </section>
            {
                addNewQuest && (
                    <AddNewQuestOverlay onClose={() => { setAddNewQuest(false) }} onAddQuest={quest => addNewReq(quest)} quests={initialState.quests} />
                )}
        </>
    )
}
export default QuestPage;