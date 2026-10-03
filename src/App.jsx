import React ,{useEffect, useState} from "react";
import AppHeader from "./components/AppHeader";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import QuestPage from "./components/QuestPage"
import SettingsPage from "./components/SettingsPage.jsx";
import "./styles.css";
import { navItems,initialState } from "../data/data.js";
import { Route, Routes } from "react-router-dom";
import {
  calculateLevel,
  getLevelTitle,
  MAX_XP,
  DAILY_QUEST_XP_LIMIT,
  MIN_DAILY_QUEST_XP,
  MAX_DAILY_QUEST_XP,
} from "./utils/helperFunctions.js";

const STORAGE_KEY = "levelup-state-v2";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeAppState(value) {
  if (!isRecord(value) || !isRecord(value.profile) || !Array.isArray(value.quests)) {
    throw new Error("Data must include a profile and a quests array.");
  }

  const profile = { ...initialState.profile, ...value.profile };
  profile.xp = Math.min(MAX_XP, Math.max(0, profile.xp));
  profile.title = getLevelTitle(calculateLevel(profile.xp));
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
    && Number.isInteger(quest.xp)
    && quest.xp >= MIN_DAILY_QUEST_XP
    && quest.xp <= MAX_DAILY_QUEST_XP
    && typeof quest.completed === "boolean"
  );
  const totalDailyQuestXP = value.quests.reduce((total, quest) =>
    total + (isRecord(quest) && Number.isFinite(quest.xp) ? quest.xp : 0), 0);

  if (!validProfile || !validQuests || totalDailyQuestXP > DAILY_QUEST_XP_LIMIT) {
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
    setAppState((previous) => {
      const selectedQuest = previous.quests.find((quest) => quest.id === questId);
      if (!selectedQuest) return previous;

      const completed = !selectedQuest.completed;
      const xp = Math.min(MAX_XP, Math.max(0, previous.profile.xp + (completed ? selectedQuest.xp : -selectedQuest.xp)));
      return {
        ...previous,
        profile: { ...previous.profile, xp, title: getLevelTitle(calculateLevel(xp)) },
        quests: previous.quests.map((quest) =>
          quest.id === questId ? { ...quest, completed } : quest
        ),
      };
    });
  }
 function AddQuest(quest) {
    setAppState((previous) => {
      const totalDailyQuestXP = previous.quests.reduce((total, item) => total + item.xp, 0);
      if (
        !Number.isInteger(quest.xp)
        || quest.xp < MIN_DAILY_QUEST_XP
        || quest.xp > MAX_DAILY_QUEST_XP
        || totalDailyQuestXP + quest.xp > DAILY_QUEST_XP_LIMIT
      ) return previous;

      return { ...previous, quests: [...previous.quests, quest] };
    });
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
  async function exportExcel() {
    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "LEVELUP";

      const profileSheet = workbook.addWorksheet("Profile");
      profileSheet.columns = [
        { header: "Field", key: "field", width: 24 },
        { header: "Value", key: "value", width: 30 },
      ];
      profileSheet.addRows([
        { field: "Name", value: appState.profile.name },
        { field: "Title", value: appState.profile.title },
        { field: "Level", value: calculateLevel(appState.profile.xp) },
        { field: "XP", value: appState.profile.xp },
        { field: "Coins", value: appState.profile.coins },
        { field: "Streak", value: appState.profile.streak },
        { field: "Daily Quest XP", value: appState.quests.reduce((total, quest) => total + quest.xp, 0) },
      ]);

      const questSheet = workbook.addWorksheet("Quests");
      questSheet.columns = [
        { header: "ID", key: "id", width: 12 },
        { header: "Quest", key: "title", width: 42 },
        { header: "Category", key: "category", width: 18 },
        { header: "XP", key: "xp", width: 10 },
        { header: "Completed", key: "completed", width: 14 },
      ];
      questSheet.addRows(appState.quests.map((quest) => ({ ...quest, completed: quest.completed ? "Yes" : "No" })));

      const habitSheet = workbook.addWorksheet("Habits");
      habitSheet.columns = [
        { header: "Habit", key: "name", width: 24 },
        { header: "Icon", key: "icon", width: 10 },
        ...Array.from({ length: 7 }, (_, index) => ({ header: `Day ${index + 1}`, key: `day${index + 1}`, width: 12 })),
      ];
      habitSheet.addRows(appState.habits.map((habit) => ({
        name: habit.name,
        icon: habit.icon,
        ...Object.fromEntries(habit.completed.map((completed, index) => [`day${index + 1}`, completed ? "Done" : ""])),
      })));

      const activitySheet = workbook.addWorksheet("Activity");
      activitySheet.columns = [
        { header: "Day", key: "day", width: 18 },
        { header: "XP", key: "xp", width: 12 },
      ];
      activitySheet.addRows(appState.weeklyXP.map((xp, index) => ({ day: `Day ${index + 1}`, xp })));
      activitySheet.addRow({ day: "Focus sessions", xp: appState.focusSessions });
      activitySheet.addRow({ day: "Focus minutes", xp: appState.focusMinutes });

      const settingsSheet = workbook.addWorksheet("Settings");
      settingsSheet.columns = [
        { header: "Setting", key: "setting", width: 24 },
        { header: "Value", key: "value", width: 24 },
      ];
      settingsSheet.addRows(Object.entries(appState.settings).map(([setting, value]) => ({ setting, value })));

      const buffer = await workbook.xlsx.writeBuffer();
      const file = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = "levelup-data.xlsx";
      downloadLink.click();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0);
      setDataTransferMessage("Data exported as levelup-data.xlsx.");
    } catch {
      setDataTransferMessage("Excel export failed. Please try again.");
    }
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
            onExportExcel={exportExcel}
          />
          {dataTransferMessage && (
            <p className="data-transfer-status" role="status">{dataTransferMessage}</p>
          )}
          <Routes>
            <Route index element={<HomePage initialState={appState}  onToggleQuest={toggleQuest} AddQuest={AddQuest}/>}/>
            <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} />} />
            <Route path="/settings" element={<SettingsPage initialState={appState} ChangeUsername={ChangeUsername} onReset={resetData} onToggleNotifications={toggleNotifications} onChangeTheme={changeTheme} onImportData={importData} onExportData={exportData} onExportExcel={exportExcel}/>} />
          </Routes>
        </div>
    </div>
  );
}
export default App;