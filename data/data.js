export const initialState = {
  profile: {
    name: "",
    age: 0,
    avatar: "",
    title: "Beginner",
    xp: 0,
    coins: 0,
    streak: 0
  },
  quests: [
    { id: 1, title: "Drink a glass of water", category: "Health", xp: 2, completed: false, completedOn: null, dailyXPReward: 0 },
    { id: 2, title: "Take a 10-minute walk", category: "Fitness", xp: 2, completed: false, completedOn: null, dailyXPReward: 0 },
    { id: 3, title: "Focus on one priority for 25 minutes", category: "Productivity", xp: 2, completed: false, completedOn: null, dailyXPReward: 0 },
    { id: 4, title: "Review notes or learn something new", category: "Learning", xp: 2, completed: false, completedOn: null, dailyXPReward: 0 },
    { id: 5, title: "Write down tomorrow's top priority", category: "Personal", xp: 2, completed: false, completedOn: null, dailyXPReward: 0 }
  ],
  habits: [
    { id: 1, name: "Water", icon: "💧", completed: [false, false, false, false, false, false, false] },
    { id: 2, name: "Move", icon: "🏋️", completed: [false, false, false, false, false, false, false] },
    { id: 3, name: "Read", icon: "📖", completed: [false, false, false, false, false, false, false] },
    { id: 4, name: "Learn", icon: "💻", completed: [false, false, false, false, false, false, false] }
  ],
  focusSessions: 0,
  focusMinutes: 0,
  weeklyXP: [0, 0, 0, 0, 0, 0, 0],
  lastQuestCompletionDate: null,
  goals: {
    description: "",
    durationMonths: 1,
    startedOn: null,
    startingXP: null,
  },
  settings: {
    notifications: true,
    notificationTime: "09:00",
    compact: false,
    theme: "rift",
    features: {
      journal: false,
      mood: false,
      expenses: false,
      calories: false,
    },
    journalEntries: [],
    moodEntries: [],
    expenses: [],
    calorieEntries: [],
  }
};

export const themeOptions = [
  { value: "rift", label: "Rift Hunter", color: "#70d9ee" },
  { value: "rose", label: "Rose", color: "#996ff5" },
  { value: "ocean", label: "Ocean", color: "#4a9fc0" },
  { value: "forest", label: "Forest", color: "#63945f" },
  { value: "sunset", label: "Sunset", color: "#d7654c" },
  { value: "midnight", label: "Midnight", color: "#5d9dff" },
  { value: "galaxy", label: "Galaxy", color: "#bd79ff" },
];

export const avatarOptions = [
  { value: "⚔️", label: "Blade" },
  { value: "🛡️", label: "Guardian" },
  { value: "🏹", label: "Ranger" },
  { value: "🔮", label: "Oracle" },
  { value: "✨", label: "Spark" },
  { value: "🌙", label: "Lunar" },
  { value: "⚡", label: "Storm" },
  { value: "🧭", label: "Scout" },
];

export const achievements = [
  { id: "first", icon: "🎯", name: "First Quest", description: "Complete your first quest", type: "quests", value: 1 },
  { id: "streak7", icon: "🔥", name: "7 Day Streak", description: "Stay consistent for 7 days", type: "streak", value: 7 },
  { id: "xp1000", icon: "🏆", name: "XP Hunter", description: "Earn 1,000 XP", type: "xp", value: 1000 },
  { id: "coding10", icon: "💻", name: "Coding Machine", description: "Complete 10 learning quests", type: "learning", value: 10 },
  { id: "focus10", icon: "🎧", name: "Focus Master", description: "Complete 10 focus sessions", type: "focus", value: 10 }
];

export const navItems = [
  { label: "Dashboard", path: "/", icon: "⌂" },
  { label: "Quests", path: "/quests", icon: "◎" },
  { label: "Daily Journal", path: "/journal", icon: "✎", featureKey: "journal" },
  { label: "Mood Tracker", path: "/mood", icon: "☻", featureKey: "mood" },
  { label: "Expense Tracker", path: "/expenses", icon: "₹", featureKey: "expenses" },
  { label: "Calorie Tracker", path: "/calories", icon: "◉", featureKey: "calories" },
  { label: "Settings", path: "/settings", icon: "⚙" }
];