import React, { useState } from "react";
import AddNewQuestOverlay from "./AddNewQuestOverlay";
function QuestCard({ initialState,onToggleQuest ,AddQuest}) {
    const [quests, setQuests] = useState(initialState.quests);
     const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);

    function changeQuestStatus(questId) {
        onToggleQuest(questId)
        setQuests(prevQuests =>
            prevQuests.map(quest =>
                quest.id === questId ? { ...quest, completed: !quest.completed } : quest
            )
        );
    }
        function addNewReq(quest) {
        AddQuest(quest)
     setQuests(previous => [...previous, quest])
     setIsAddQuestOpen(false)
    }
    return (
        <>
         <section className="card quests-card">
            <div className="section-title">
                <div>
                    <h2>Today's Quest</h2>
                    <p>Complete your quests, earn XP and level up!</p>
                </div>
                <button className="btn btn-primary"  onClick={()=>setIsAddQuestOpen(true)}> + Add Quest</button>
               
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
                        <span className="quest-xp">+ {quest.xp} XP</span>

                    </div>

                </div>
            ))
            }
            </section>
             {isAddQuestOpen && (
        <AddNewQuestOverlay
  onClose={() => setIsAddQuestOpen(false)}
  onAddQuest={quest => addNewReq(quest)}/>
      )} 
        </>

    )
}
export default QuestCard;