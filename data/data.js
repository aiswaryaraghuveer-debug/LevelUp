export const initialState = {
  profile: {
    name: "Ash",
    title: "Rookie Adventurer",
    xp:100,
    coins: 0,
    streak: 70
  },
  quests: [
    { id: 1, title: "Drink 3L water", category: "Health", xp: 30, completed: true },
    { id: 2, title: "Complete React practice", category: "Learning", xp: 100, completed: false },
    { id: 3, title: "30 minute workout", category: "Fitness", xp: 80, completed: false },
    { id: 4, title: "Read 20 pages", category: "Personal", xp: 40, completed: false },
    { id: 5, title: "Plan tomorrow", category: "Productivity", xp: 30, completed: false }
  ],
  habits: [
    { id: 1, name: "Water", icon: "💧", completed: [true, true, true, true, false, false, false] },
    { id: 2, name: "Gym", icon: "🏋️", completed: [true, true, false, true, false, false, false] },
    { id: 3, name: "Read", icon: "📖", completed: [true, true, true, false, false, false, false] },
    { id: 4, name: "Coding", icon: "💻", completed: [true, true, true, true, true, false, false] }
  ],
  focusSessions: 17,
  focusMinutes: 265,
  weeklyXP: [80, 140, 60, 180, 120, 210, 160],
  settings: {
    notifications: true,
    compact: false
  }
};

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
  { label: "Habits", path: "/habits", icon: "♧" },
  { label: "Focus", path: "/focus", icon: "◷" },
  { label: "Analytics", path: "/analytics", icon: "▥" },
  { label: "Achievements", path: "/achievements", icon: "♜" },
  { label: "Settings", path: "/settings", icon: "⚙" }
];