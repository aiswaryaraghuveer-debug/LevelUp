import React ,{useEffect, useRef, useState} from "react";
import AppHeader from "./components/AppHeader";
import AuthScreen from "./components/AuthScreen.jsx";
import SideBar from "./components/SideBar";
import BrandLogo from "./components/BrandLogo.jsx";
import HomePage from "./components/HomePage";
import QuestPage from "./components/QuestPage"
import SettingsPage from "./components/SettingsPage.jsx";
import JournalPage from "./components/JournalPage.jsx";
import MoodPage from "./components/MoodPage.jsx";
import ExpensePage from "./components/ExpensePage.jsx";
import CaloriePage from "./components/CaloriePage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import DailyBriefing from "./components/DailyBriefing.jsx";
import "./styles.css";
import { avatarOptions, navItems, initialState, themeOptions } from "../data/data.js";
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

const LEGACY_STORAGE_KEY = "levelup-state-v2";
const ACCOUNTS_STORAGE_KEY = "levelup-accounts-v1";
const SESSION_STORAGE_KEY = "levelup-session-v1";
const PASSWORD_ITERATIONS = 210000;

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function getStateStorageKey(username) {
  return `${LEGACY_STORAGE_KEY}:${encodeURIComponent(username)}`;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) throw new Error("Secure password storage is unavailable in this browser.");
  const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ITERATIONS }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}

function readAccounts() {
  const savedAccounts = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!savedAccounts) return [];
  const accounts = JSON.parse(savedAccounts);
  if (!Array.isArray(accounts) || !accounts.every((account) =>
    isRecord(account)
    && typeof account.username === "string"
    && typeof account.key === "string"
    && typeof account.passwordSalt === "string"
    && typeof account.passwordHash === "string"
  )) throw new Error("Saved accounts could not be read. Your existing data has not been changed.");
  return accounts;
}

function loadSessionAccount() {
  try {
    const accountKey = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return accountKey ? readAccounts().find((account) => account.key === accountKey) || null : null;
  } catch {
    return null;
  }
}

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
  profile.age = Number.isInteger(profile.age) && profile.age >= 0 && profile.age <= 120 ? profile.age : 0;
  profile.avatar = avatarOptions.some((avatar) => avatar.value === profile.avatar) ? profile.avatar : "";
  profile.xp = Math.min(MAX_XP, Math.max(0, profile.xp));
  profile.title = getLevelTitle(calculateLevel(profile.xp));
  const validProfile = typeof profile.name === "string"
    && typeof profile.avatar === "string"
    && typeof profile.title === "string"
    && Number.isInteger(profile.age)
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
    settings: {
      ...initialState.settings,
      ...settings,
      theme: themeOptions.some((theme) => theme.value === settings.theme) ? settings.theme : initialState.settings.theme,
      notificationTime: typeof settings.notificationTime === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.notificationTime) ? settings.notificationTime : initialState.settings.notificationTime,
      features: { ...initialState.settings.features, ...(isRecord(settings.features) ? settings.features : {}) },
      journalEntries: Array.isArray(settings.journalEntries) ? settings.journalEntries : [],
      moodEntries: Array.isArray(settings.moodEntries) ? settings.moodEntries : [],
      expenses: Array.isArray(settings.expenses) ? settings.expenses : [],
      expenseIncome: Number.isFinite(Number(settings.expenseIncome)) ? Number(settings.expenseIncome) : Number(initialState.settings.expenseIncome || 0),
      expenseGoal: Number.isFinite(Number(settings.expenseGoal)) ? Number(settings.expenseGoal) : Number(initialState.settings.expenseGoal || 0),
      calorieEntries: Array.isArray(settings.calorieEntries) ? settings.calorieEntries : [],
    },
  };
}

function playQuestCompleteSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const now = context.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.09 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.22);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + 0.24);
    });
    window.setTimeout(() => context.close().catch(() => {}), 700);
  } catch {}
}

function loadAppState(storageKey) {
  try {
    const savedState = window.localStorage.getItem(storageKey);
    if (!savedState) return initialState;
    return normalizeAppState(JSON.parse(savedState));
  } catch {
    return initialState;
  }
}

function App() {
  const [account, setAccount] = useState(loadSessionAccount);

  async function signIn({ username, password }) {
    const key = normalizeUsername(username);
    const existingAccount = readAccounts().find((savedAccount) => savedAccount.key === key);
    if (!existingAccount) throw new Error("Username or password is incorrect.");
    const salt = Uint8Array.from(existingAccount.passwordSalt.match(/.{1,2}/g) || [], (byte) => Number.parseInt(byte, 16));
    const passwordHash = await hashPassword(password, salt);
    if (passwordHash !== existingAccount.passwordHash) throw new Error("Username or password is incorrect.");
    window.localStorage.setItem(SESSION_STORAGE_KEY, existingAccount.key);
    setAccount(existingAccount);
  }

  async function signUp({ username, password, age, goals, goalDurationMonths, avatar, theme }) {
    const cleanUsername = username.trim();
    const key = normalizeUsername(cleanUsername);
    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(cleanUsername)) {
      throw new Error("Username must be 3–32 characters using letters, numbers, dots, dashes, or underscores.");
    }
    const accounts = readAccounts();
    if (accounts.some((savedAccount) => savedAccount.key === key)) throw new Error("That username already exists. Sign in instead.");

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const newAccount = {
      username: cleanUsername,
      key,
      passwordSalt: bytesToHex(salt),
      passwordHash: await hashPassword(password, salt),
    };
    let startingState = initialState;
    if (accounts.length === 0) {
      try {
        const legacySave = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacySave) startingState = normalizeAppState(JSON.parse(legacySave));
      } catch {
        startingState = initialState;
      }
    }
    const signupGoals = goals.trim();
    const goalDescription = signupGoals || startingState.goals.description;
    const goalPlanChanged = goalDescription !== startingState.goals.description
      || goalDurationMonths !== startingState.goals.durationMonths;
    const newState = normalizeAppState({
      ...startingState,
      profile: { ...startingState.profile, name: cleanUsername, age, avatar },
      goals: {
        ...startingState.goals,
        description: goalDescription,
        durationMonths: goalDurationMonths,
        ...(goalPlanChanged && goalDescription.trim()
          ? { startedOn: getLocalDateKey(), startingXP: startingState.profile.xp }
          : {}),
      },
      settings: { ...startingState.settings, theme },
    });

    window.localStorage.setItem(getStateStorageKey(key), JSON.stringify(newState));
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, newAccount]));
    window.localStorage.setItem(SESSION_STORAGE_KEY, key);
    setAccount(newAccount);
  }

  function signOut() {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setAccount(null);
    }
  }

  if (!account) return <AuthScreen onSignIn={signIn} onSignUp={signUp} />;
  return <AuthenticatedApp account={account} onLogout={signOut} />;
}

function AuthenticatedApp({ account, onLogout }) {
  const storageKey = getStateStorageKey(account.key);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appState, setAppState] = useState(() => loadAppState(storageKey));
  const [dataTransferMessage, setDataTransferMessage] = useState("");
  const [questCelebrationId, setQuestCelebrationId] = useState(0);
  const [briefingMode, setBriefingMode] = useState(null);
  useEffect(() => {
    const hour = new Date().getHours();
    const mode = hour >= 5 && hour < 12 ? "morning" : hour >= 18 ? "night" : null;
    if (!mode) return;
    const dateKey = getLocalDateKey();
    const briefingKey = "levelup-briefing-v1:" + account.key + ":" + dateKey + ":" + mode;
    if (window.localStorage.getItem(briefingKey)) return;
    window.localStorage.setItem(briefingKey, "shown");
    setBriefingMode(mode);
  }, [account.key]);

  const enabledNavItems = navItems.filter((item) => !item.featureKey || appState.settings.features?.[item.featureKey]);

  useEffect(() => {
    try {
      const previousSave = window.localStorage.getItem(storageKey);
      if (previousSave) window.localStorage.setItem(`${storageKey}:backup`, previousSave);
      window.localStorage.setItem(storageKey, JSON.stringify(appState));
    } catch {
      setDataTransferMessage("Progress could not be saved. Export a backup before leaving this browser.");
    }
  }, [appState, storageKey]);

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

  useEffect(() => {
    if (!appState.settings.notifications || !("Notification" in window)) return undefined;
    let timer;
    async function scheduleNotification() {
      if (Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch { return; }
      }
      if (Notification.permission !== "granted") return;
      const [hours, minutes] = (appState.settings.notificationTime || "09:00").split(":").map(Number);
      const now = new Date();
      const next = new Date(now);
      next.setHours(hours, minutes, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      timer = window.setTimeout(() => {
        const features = appState.settings.features || {};
        const names = [features.journal && "journal", features.mood && "mood", features.expenses && "expense", features.calories && "calorie"].filter(Boolean);
        const suffix = names.length ? ` Time for your ${names.join(", ")} check-in.` : " Keep your daily progress moving.";
        try { new Notification("Arise — Daily reminder", { body: `Your daily check-in is ready.${suffix}`, icon: "/arise-192.png" }); } catch {}
        scheduleNotification();
      }, Math.max(1000, next.getTime() - now.getTime()));
    }
    scheduleNotification();
    return () => window.clearTimeout(timer);
  }, [appState.settings.notifications, appState.settings.notificationTime, appState.settings.features, storageKey]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setIsSidebarOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSidebarOpen]);

  function toggleQuest(questId) {
    const today = getLocalDateKey();
    const selectedQuest = appState.quests.find((quest) => quest.id === questId);
    const completesFinalQuest = selectedQuest
      && (!selectedQuest.completed || selectedQuest.completedOn !== today)
      && appState.quests.every((quest) =>
        quest.id === questId || (quest.completed && quest.completedOn === today)
      );

    if (completesFinalQuest) {
      setQuestCelebrationId((previous) => previous + 1);
      playQuestCompleteSound();
    }

    setAppState((previous) => {
      const currentDate = getLocalDateKey();
      let selectedTodayQuest = null;
      let dailyXPEarned = 0;
      let pendingQuestCount = 0;
      const todaysQuests = previous.quests.map((quest) => {
        const todayQuest = quest.completed && quest.completedOn !== currentDate
          ? { ...quest, completed: false, completedOn: null, dailyXPReward: 0 }
          : quest;
        if (todayQuest.id === questId) selectedTodayQuest = todayQuest;
        if (todayQuest.completed) dailyXPEarned += todayQuest.dailyXPReward;
        else if (todayQuest.id !== questId) pendingQuestCount += 1;
        return todayQuest;
      });
      if (!selectedTodayQuest) return previous;

      const completed = !selectedTodayQuest.completed;
      const goals = previous.goals.startedOn
        ? previous.goals
        : { ...previous.goals, startedOn: currentDate, startingXP: previous.profile.xp };
      const goalTarget = getGoalTarget(goals, previous.profile.xp);
      const remainingDailyXP = Math.max(0, goalTarget.dailyXP - dailyXPEarned);
      const distributedReward = completed
        ? getQuestXPDistribution(todaysQuests, goalTarget.dailyXP).find((reward) => reward.id === questId)?.xp || 0
        : 0;
      const completionReward = pendingQuestCount === 0
        ? remainingDailyXP
        : Math.min(distributedReward, remainingDailyXP);
      const xpDelta = completed ? completionReward : -selectedTodayQuest.dailyXPReward;
      const xp = Math.min(MAX_XP, Math.max(0, previous.profile.xp + xpDelta));
      const streakProgress = completed
        ? getStreakAfterQuestCompletion(previous.profile.streak, previous.lastQuestCompletionDate)
        : { streak: previous.profile.streak, lastCompletedDate: previous.lastQuestCompletionDate };
      return {
        ...previous,
        goals,
        profile: { ...previous.profile, xp, title: getLevelTitle(calculateLevel(xp)), streak: streakProgress.streak },
        lastQuestCompletionDate: streakProgress.lastCompletedDate,
        activityHistory,
        quests: todaysQuests.map((quest) =>
          quest.id === questId
            ? {
              ...quest,
              completed,
              completedOn: completed ? currentDate : null,
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
  function resetTracker(trackerKey) {
    const trackerData = {
      journal: { journalEntries: [] },
      mood: { moodEntries: [] },
      expenses: { expenses: [], expenseIncome: 0, expenseGoal: 0 },
      calories: { calorieEntries: [] },
    };
    if (!trackerData[trackerKey]) return;
    setAppState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        ...trackerData[trackerKey],
        features: {
          ...previous.settings.features,
          [trackerKey]: false,
        },
      },
    }));
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
  function changeFeatures(features) {
    setAppState((previous) => ({
      ...previous,
      settings: { ...previous.settings, features: { ...previous.settings.features, ...features } },
    }));
  }
  function changeNotificationTime(notificationTime) {
    setAppState((previous) => ({ ...previous, settings: { ...previous.settings, notificationTime } }));
  }
  function changeTrackerData(data) {
    setAppState((previous) => ({ ...previous, settings: { ...previous.settings, ...data } }));
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
      const parsed = JSON.parse(await file.text());
      const importedState = normalizeAppState(parsed?.state && typeof parsed.state === "object" ? parsed.state : parsed);
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
        { field: "Age", value: appState.profile.age || "Not set" },
        { field: "Avatar", value: appState.profile.avatar || "Default" },
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
  function changeAvatar(avatar) {
    setAppState((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        avatar: avatarOptions.some((option) => option.value === avatar) ? avatar : "",
      },
    }));
  }
  function changeAge(age) {
    setAppState((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        age: Number.isInteger(age) && age >= 0 && age <= 120 ? age : previous.profile.age,
      },
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
        {questCelebrationId > 0 && (
          <div
            key={questCelebrationId}
            className="quest-day-celebration"
            role="status"
            aria-live="polite"
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setQuestCelebrationId(0);
            }}
          >
            <span className="quest-day-celebration-message">All quests complete!</span>
          </div>
        )}
        <SideBar navItems={enabledNavItems} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {isSidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setIsSidebarOpen(false)} />}
        <div className="main">
          <AppHeader
            initialState={appState}
            onToggleMenu={() => setIsSidebarOpen((open) => !open)}
            isMenuOpen={isSidebarOpen}
            onChangeTheme={changeTheme}
            onExportData={exportData}
            onExportExcel={exportExcel}
            onLogout={onLogout}
          />
          <div className="main-content">
            {dataTransferMessage && (
              <p className="data-transfer-status" role="status">{dataTransferMessage}</p>
            )}
            <Routes>
              <Route index element={<HomePage initialState={appState} onToggleQuest={toggleQuest} AddQuest={AddQuest} onDeleteQuest={deleteQuest} onEditQuest={editQuest} />}/>
              <Route path="/quests" element={<QuestPage initialState={appState} AddQuest={AddQuest} onToggleQuest={toggleQuest} onDeleteQuest={deleteQuest} onEditQuest={editQuest} />} />
              <Route path="/settings" element={<SettingsPage initialState={appState} ChangeUsername={ChangeUsername} onChangeAge={changeAge} onChangeAvatar={changeAvatar} onChangeGoals={changeGoals} onReset={resetData} onResetTracker={resetTracker} onToggleNotifications={toggleNotifications} onChangeNotificationTime={changeNotificationTime} onChangeFeatures={changeFeatures} onChangeTheme={changeTheme} onImportData={importData} onExportData={exportData} onExportExcel={exportExcel}/>} />
              <Route path="/journal" element={<JournalPage initialState={appState} onChange={changeTrackerData} />} />
              <Route path="/mood" element={<MoodPage initialState={appState} onChange={changeTrackerData} />} />
              <Route path="/expenses" element={<ExpensePage initialState={appState} onChange={changeTrackerData} />} />
              <Route path="/calories" element={<CaloriePage initialState={appState} onChange={changeTrackerData} />} />
              <Route path="/analytics" element={<AnalyticsPage initialState={appState} />} />
            </Routes>
          </div>
          <footer className="app-footer">
            <div className="app-footer-brand">
              <BrandLogo className="app-footer-icon" />
              <span>Arise</span>
            </div>
            <p className="app-footer-copyright">© {new Date().getFullYear()} Aiswarya Raghuveer. All rights reserved.</p>
            <div className="app-footer-meta">
              <span>Released October 3, 2026</span>
              <span>Version 0.0.2</span>
              <a href="mailto:aiswaryaraghuveer@gmail.com">aiswaryaraghuveer@gmail.com</a>
            </div>
          </footer>
        </div>
    </div>
  );
}
export default App;