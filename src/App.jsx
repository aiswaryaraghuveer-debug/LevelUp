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
  MIN_GOAL_DURATION_MONTHS,
  MAX_GOAL_DURATION_MONTHS,
  MIN_DAILY_QUEST_XP,
  MAX_DAILY_QUEST_XP,
  getStreakAfterQuestCompletion,
  getGoalTarget,
  getLocalDateKey,
  getQuestXPDistribution,
} from "./utils/helperFunctions.js";

const STORAGE_KEY = "levelup-state-v2";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
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
  const today = getLocalDateKey();
    const lastQuestCompletionDate = isDateKey(value.lastQuestCompletionDate)
    ? value.lastQuestCompletionDate
    : null;
  const quests = value.quests.map((quest) => {
    const completedOn = isDateKey(quest.completedOn)
      ? quest.completedOn
      : quest.completed && isDateKey(lastQuestCompletionDate) ? lastQuestCompletionDate : null;
    const completedToday = completedOn === today;
    return {
      ...quest,
      completed: completedToday,
      completedOn: completedToday ? today : null,
      dailyXPReward: completedToday
        ? Number.isFinite(quest.dailyXPReward) ? quest.dailyXPReward : quest.xp
        : 0,
    };
  });
  const storedGoals = isRecord(value.goals)
    && typeof value.goals.description === "string"
    && Number.isInteger(value.goals.durationMonths)
    && value.goals.durationMonths >= MIN_GOAL_DURATION_MONTHS
    && value.goals.durationMonths <= MAX_GOAL_DURATION_MONTHS
    ? value.goals
    : initialState.goals;
  const validStartDate = isDateKey(storedGoals.startedOn);
  const goals = {
    ...initialState.goals,
    ...storedGoals,
    startedOn: validStartDate
      ? storedGoals.startedOn
      : storedGoals.description.trim() ? today : null,
    startingXP: Number.isFinite(storedGoals.startingXP)
      ? Math.min(MAX_XP, Math.max(0, storedGoals.startingXP))
      : profile.xp,
  };

  return {
    ...initialState,
    ...value,
    profile,
    quests,
    habits: validHabits ? value.habits : initialState.habits,
    focusSessions: Number.isFinite(value.focusSessions) ? value.focusSessions : initialState.focusSessions,
    focusMinutes: Number.isFinite(value.focusMinutes) ? value.focusMinutes : initialState.focusMinutes,
    weeklyXP: validWeeklyXP ? value.weeklyXP : initialState.weeklyXP,
    lastQuestCompletionDate,
    goals,
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      const today = getLocalDateKey();
      setAppState((previous) => {
        let hasStaleCompletions = false;
        const quests = previous.quests.map((quest) => {
          if (!quest.completed || quest.completedOn === today) return quest;
          hasStaleCompletions = true;
          return { ...quest, completed: false, completedOn: null, dailyXPReward: 0 };
        });
        return hasStaleCompletions ? { ...previous, quests } : previous;
      });
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  function toggleQuest(questId) {
    setAppState((previous) => {
      const today = getLocalDateKey();
      const todaysQuests = previous.quests.map((quest) => {
        if (!quest.completed || quest.completedOn === today) return quest;
        return { ...quest, completed: false, completedOn: null, dailyXPReward: 0 };
      });
      const selectedQuest = todaysQuests.find((quest) => quest.id === questId);
      if (!selectedQuest) return previous;

      const completed = !selectedQuest.completed;
      const goals = previous.goals.startedOn
        ? previous.goals
        : { ...previous.goals, startedOn: today, startingXP: previous.profile.xp };
      const goalTarget = getGoalTarget(goals, previous.profile.xp);
      const rewardDistribution = getQuestXPDistribution(todaysQuests, goalTarget.dailyXP);
      const dailyXPEarned = todaysQuests.reduce((total, quest) =>
        total + (quest.completed ? quest.dailyXPReward : 0), 0);
      const remainingDailyXP = Math.max(0, goalTarget.dailyXP - dailyXPEarned);
      const pendingQuestsAfterToggle = todaysQuests.filter((quest) =>
        !quest.completed && quest.id !== questId
      ).length;
      const distributedReward = rewardDistribution.find((reward) => reward.id === questId)?.xp || 0;
      const completionReward = pendingQuestsAfterToggle === 0
        ? remainingDailyXP
        : Math.min(distributedReward, remainingDailyXP);
      const xpDelta = completed ? completionReward : -selectedQuest.dailyXPReward;
      const xp = Math.min(MAX_XP, Math.max(0, previous.profile.xp + xpDelta));
      const streakProgress = completed
        ? getStreakAfterQuestCompletion(previous.profile.streak, previous.lastQuestCompletionDate)
        : { streak: previous.profile.streak, lastCompletedDate: previous.lastQuestCompletionDate };
      return {
        ...previous,
        goals,
        profile: { ...previous.profile, xp, title: getLevelTitle(calculateLevel(xp)), streak: streakProgress.streak },
        lastQuestCompletionDate: streakProgress.lastCompletedDate,
        quests: todaysQuests.map((quest) =>
          quest.id === questId
            ? {
              ...quest,
              completed,
              completedOn: completed ? today : null,
              dailyXPReward: completed ? completionReward : 0,
            }
            : quest
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

      return {
        ...previous,
        quests: [...previous.quests, { ...quest, completed: false, completedOn: null, dailyXPReward: 0 }],
      };
    });
  }
  function editQuest(editedQuest) {
    setAppState((previous) => {
      const existingQuest = previous.quests.find((quest) => quest.id === editedQuest.id);
      if (!existingQuest) return previous;

      const otherQuestXP = previous.quests
        .filter((quest) => quest.id !== editedQuest.id)
        .reduce((total, quest) => total + quest.xp, 0);
      if (
        !Number.isInteger(editedQuest.xp)
        || editedQuest.xp < MIN_DAILY_QUEST_XP
        || editedQuest.xp > MAX_DAILY_QUEST_XP
        || otherQuestXP + editedQuest.xp > DAILY_QUEST_XP_LIMIT
      ) return previous;

      return {
        ...previous,
        quests: previous.quests.map((quest) => quest.id === editedQuest.id ? editedQuest : quest),
      };
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
      setDataTransferMessage("Import failed. Choose a valid Arise JSON export.");
    }
  }
  function exportData() {
    const file = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
    const fileUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = "arise-data.json";
    downloadLink.click();
    URL.revokeObjectURL(fileUrl);
    setDataTransferMessage("Data exported as arise-data.json.");
  }
  async function exportExcel() {
    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Arise";

      const profileSheet = workbook.addWorksheet("Profile");
      const goalTarget = getGoalTarget(appState.goals, appState.profile.xp);
      const questRewards = new Map(getQuestXPDistribution(appState.quests, goalTarget.dailyXP).map((reward) => [reward.id, reward.xp]));
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
        { field: "Quest XP Weights", value: appState.quests.reduce((total, quest) => total + quest.xp, 0) },
        { field: "Goal", value: appState.goals.description },
        { field: "Goal duration (months)", value: goalTarget.months },
        { field: "Goal duration (days)", value: goalTarget.days },
        { field: "Goal XP target", value: goalTarget.xp },
        { field: "Goal level target", value: goalTarget.level },
        { field: "Today's goal XP", value: goalTarget.dailyXP },
      ]);

      const questSheet = workbook.addWorksheet("Quests");
      questSheet.columns = [
        { header: "ID", key: "id", width: 12 },
        { header: "Quest", key: "title", width: 42 },
        { header: "Category", key: "category", width: 18 },
        { header: "XP weight", key: "xp", width: 12 },
        { header: "Today's XP", key: "todayXP", width: 12 },
        { header: "Completed", key: "completed", width: 14 },
      ];
      questSheet.addRows(appState.quests.map((quest) => ({
        ...quest,
        todayXP: quest.completed ? quest.dailyXPReward : questRewards.get(quest.id) || 0,
        completed: quest.completed ? "Yes" : "No",
      })));

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
      downloadLink.download = "arise-data.xlsx";
      downloadLink.click();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 0);
      setDataTransferMessage("Data exported as arise-data.xlsx.");
    } catch {
      setDataTransferMessage("Arise Excel export failed. Please try again.");
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
  function changeGoals(goals) {
    setAppState((previous) => {
      const startsNewPlan = (goals.durationMonths !== undefined && goals.durationMonths !== previous.goals.durationMonths)
        || (goals.description?.trim() && !previous.goals.description.trim() && !previous.goals.startedOn);
      return {
        ...previous,
        goals: {
          ...previous.goals,
          ...goals,
          ...(startsNewPlan ? { startedOn: getLocalDateKey(), startingXP: previous.profile.xp } : {}),
        },
      };
    });
  }
  return (
    <div className="app" data-theme={appState.settings.theme || "rift"}>
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
            <Route index element={<HomePage initialState={appState} onToggleQuest={toggleQuest} AddQuest={AddQuest} onDeleteQuest={deleteQuest} onEditQuest={editQuest} />}/>
            <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} onEditQuest={editQuest} />} />
            <Route path="/settings" element={<SettingsPage initialState={appState} ChangeUsername={ChangeUsername} onChangeGoals={changeGoals} onReset={resetData} onToggleNotifications={toggleNotifications} onChangeTheme={changeTheme} onImportData={importData} onExportData={exportData} onExportExcel={exportExcel}/>} />
          </Routes>
        </div>
    </div>
  );
}
export default App;