import React ,{useState} from "react";
import AppHeader from "./components/AppHeader";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import QuestPage from "./components/QuestPage"
import SettingsPage from "./components/SettingsPage.jsx";
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
  function resetData() {
    setAppState(initialState);
  }
  function toggleNotifications() {
    setAppState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        notifications: !previous.settings.notifications,
      },
    }));
  }
  function changeTheme(theme) {
    setAppState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        theme,
      },
    }));
  }
   function ChangeUsername(newname) {
    setAppState((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        name:newname
      }
    }));
  }
  return (
    <div className="app" data-theme={appState.settings.theme || "rose"}>
        <SideBar navItems={navItems} />
        <div className="main">
          <AppHeader initialState={appState} onChangeTheme={changeTheme} />
          <Routes>
            <Route index element={<HomePage initialState={appState}  onToggleQuest={toggleQuest} AddQuest={AddQuest}/>}/>
            <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} />} />
            <Route path="/settings" element={<SettingsPage initialState={appState} ChangeUsername={ChangeUsername} onReset={resetData} onToggleNotifications={toggleNotifications} onChangeTheme={changeTheme}/>} />
          </Routes>
        </div>
    </div>
  );
}
export default App;