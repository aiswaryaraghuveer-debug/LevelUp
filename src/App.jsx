import React ,{useEffect, useState} from "react";
import AppHeader from "./components/AppHeader";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import QuestPage from "./components/QuestPage"
import SettingsPage from "./components/SettingsPage.jsx";
import "./styles.css";
import { navItems,initialState } from "../data/data.js";
import { Route, Routes } from "react-router-dom";

const STORAGE_KEY = "levelup-state-v1";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeAppState(value) {
  if (!isRecord(value) || !isRecord(value.profile) || !Array.isArray(value.quests)) {
    throw new Error("Data must include a profile and a quests array.");
  }

  const profile = { ...initialState.profile, ...value.profile };
  const validProfile = typeof profile.name === "string"
    && typeof profile.title === "string"
    && Number.isFinite(profile.xp)
    && Number.isFinite(profile.coins)
    && Number.isFinite(profile.streak);
  const validQuests = value.quests.every((quest) =>
    isRecord(quest)
    && (typeof quest.id === "string" || typeof quest.id === "number")
    && typeof quest.title === "string"
    && typeof quest.category === "string"
    && Number.isFinite(quest.xp)
    && typeof quest.completed === "boolean"
  );

  if (!validProfile || !validQuests) {
    throw new Error("Data contains invalid profile or quest values.");
  }

  const settings = isRecord(value.settings) ? value.settings : {};
  const validHabits = Array.isArray(value.habits) && value.habits.every((habit) =>
    isRecord(habit)
    && Array.isArray(habit.completed)
    && habit.completed.every((completed) => typeof completed === "boolean")
  );
  const validWeeklyXP = Array.isArray(value.weeklyXP)
    && value.weeklyXP.every((xp) => Number.isFinite(xp));

  return {
    ...initialState,
    ...value,
    profile,
    quests: value.quests,
    habits: validHabits ? value.habits : initialState.habits,
    focusSessions: Number.isFinite(value.focusSessions) ? value.focusSessions : initialState.focusSessions,
    focusMinutes: Number.isFinite(value.focusMinutes) ? value.focusMinutes : initialState.focusMinutes,
    weeklyXP: validWeeklyXP ? value.weeklyXP : initialState.weeklyXP,
    settings: { ...initialState.settings, ...settings },
  };
}

function loadAppState() {
  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY);
    if (!savedState) return initialState;
    return normalizeAppState(JSON.parse(savedState));
  } catch {
    return initialState;
  }
}

function App() {
  const [appState, setAppState] = useState(loadAppState);
  const [dataTransferMessage, setDataTransferMessage] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {
      // Storage can be unavailable or full; keep the app usable for this session.
    }
  }, [appState]);

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
  async function importData(file) {
    try {
      const importedState = normalizeAppState(JSON.parse(await file.text()));
      setAppState(importedState);
      setDataTransferMessage("Data imported successfully.");
    } catch {
      setDataTransferMessage("Import failed. Choose a valid LEVELUP JSON export.");
    }
  }
  function exportData() {
    const file = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
    const fileUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = "levelup-data.json";
    downloadLink.click();
    URL.revokeObjectURL(fileUrl);
    setDataTransferMessage("Data exported as levelup-data.json.");
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
          <AppHeader
            initialState={appState}
            onChangeTheme={changeTheme}
            onExportData={exportData}
          />
          {dataTransferMessage && (
            <p className="data-transfer-status" role="status">{dataTransferMessage}</p>
          )}
          <Routes>
            <Route index element={<HomePage initialState={appState}  onToggleQuest={toggleQuest} AddQuest={AddQuest}/>}/>
            <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} />} />
            <Route path="/settings" element={<SettingsPage initialState={appState} ChangeUsername={ChangeUsername} onReset={resetData} onToggleNotifications={toggleNotifications} onChangeTheme={changeTheme} onImportData={importData}/>} />
          </Routes>
        </div>
    </div>
  );
}
export default App;