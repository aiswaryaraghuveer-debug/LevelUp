import React from "react";
function QuestCard({quest}){
    return (
        <div className="quests-card">
            <div  className="quest">
                <h3>{quest.title}</h3>
                <p>{quest.category}</p>
                <p>XP: {quest.xp}</p>
                <p>Status: {quest.completed ? "Completed" : "Incomplete"}</p>
            </div>
   
        </div>
    )
}
export default QuestCard;