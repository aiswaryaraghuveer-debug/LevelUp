import React,{useState} from "react";
function QuestCard({ initialState }) {
    const [quests, setQuests] = useState(initialState.quests);

    function changeQuestStatus(questId) {
        setQuests(prevQuests =>
            prevQuests.map(quest =>
                quest.id === questId ? { ...quest, completed: !quest.completed } : quest
            )
        );
    }
    return (
        <>
        <div className="section-title"> 
                <div>
                <h2>Today's Quest</h2>
                <p>Complete your quests, earn XP and level up!</p>
            </div>
            <button className="btn btn-primary"> + Add Quest</button>  </div>
        
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



        </>

    )
}
export default QuestCard;