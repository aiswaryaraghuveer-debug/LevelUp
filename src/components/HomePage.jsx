import react from "react"
import QuestCard from "./QuestCard";
import LevelCard from "./LevelCard";
import StatCard from "./StatCard.jsx";
import StreakCard from "./StreakCard.jsx"
import XPBar from "./XPBar.jsx"
import {getCompletedTasks,getHour} from "../utils/helperFunctions.js"
function HomePage({initialState,onToggleQuest,AddQuest}) {
  const questDataLenght=initialState.quests.length
  const completedQuests=getCompletedTasks(initialState.quests).length +" completed"
  const totalCoins=initialState.profile.coins
  const hour=getHour(initialState.focusMinutes)
  const habit="0/0"
  const streakDays=initialState.profile.streak
  return (
   <>
   <div className="top-grid">
     <LevelCard initialState={initialState}/>
     <StatCard  mainDig={questDataLenght} mainText={"Total Tasks"} subText={completedQuests} icon={"☷"}/>
     {/* <StatCard  mainDig={habit} mainText={"Habits Done"} subText={"This week"} icon={"♧"} />
     <StatCard  mainDig={hour} mainText={"Focus Time"} subText={"This week"} icon={"◷"}/>
     <StatCard  mainDig={totalCoins} mainText={"Coins"} subText={completedQuests} icon={"★"} /> */}
     <StreakCard streakDays={streakDays}/>
    </div>
    <div className="content-grid">
      <QuestCard initialState={initialState} onToggleQuest={onToggleQuest} AddQuest={AddQuest}/>
      <XPBar initialState={initialState}/>
    </div>
    </>
       
 
   
  );
}
export default HomePage;