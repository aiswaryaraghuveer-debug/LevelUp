import react from "react"
import QuestCard from "./QuestCard";
import {initialState} from "../../data/data.js";
function HomePage() {
  return (
   
       <div className="content-grid">
         <section className="card quests-card">
        <QuestCard initialState={initialState} />
      </section>
    </div>
 
   
  );
}
export default HomePage;