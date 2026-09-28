import react from "react"
import QuestCard from "./QuestCard";
import {initialState} from "../../data/data.js";
function HomePage() {
  return (
    <div>
      <h1>Welcome to LEVELUp!</h1>
      {initialState.quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
export default HomePage;