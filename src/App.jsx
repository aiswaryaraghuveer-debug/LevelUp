import React ,{useState} from "react";
import AppHeader from "./components/AppHeader";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import QuestPage from "./components/QuestPage"
import "./styles.css";
import { navItems,initialState } from "../data/data.js";
import { Route, Routes } from "react-router-dom";
function App() {
  const [appState, setAppState] = useState(initialState);

  function toggleQuest(questId) {
    setAppState((previous) => ({
      ...previous,
      quests: previous.quests.map((quest) =>
        quest.id === questId
          ? { ...quest, completed: !quest.completed }
          : quest
      ),
    }));
  }
 function AddQuest(quest) {
    setAppState((previous) => ({
      ...previous,
      quests: [...previous.quests, quest],
    }));
  }
  function deleteQuest(questId) {
    setAppState((previous) => ({
      ...previous,
      quests: previous.quests.filter((quest) => quest.id !== questId),
    }));
  }
  return (
    <div>
        <SideBar navItems={navItems} />
        <div className="main">
          <AppHeader />
          <Routes>
            <Route index element={<HomePage initialState={appState}  onToggleQuest={toggleQuest} AddQuest={AddQuest}/>}/>
            <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} />} />
          </Routes>
        </div>
    </div>
  );
}
export default App;