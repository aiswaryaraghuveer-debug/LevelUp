//helperFunctions.js
export function getGreeting(initialState) {
  const now = new Date();
  const hours = now.getHours();
  if (hours > 5 && hours < 12) {
    return "Good morning, " + initialState.profile.name
  } else if (hours >= 12 && hours < 18) {
    return "Good afternoon, " + initialState.profile.name
  } else if (hours >= 18 && hours < 22) {
    return "Good evening, " + initialState.profile.name
  } else {
    return "Good night, " + initialState.profile.name
  }
};

export function getCompletedTasks(tasks) {
  const completedTasks = tasks.filter(task => task.completed);
  return completedTasks;
};

export function getTaskTitles(tasks) {
  const titleArray = tasks.map(task => task.title)
  return titleArray
}

export function getXpArray(tasks) {
  const xpArray = tasks.map(task => task.xp)
  return xpArray;
};

export function getTotalXP(tasks) {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  return getXpArray(tasks).reduce((a, b) => a + b, 0);
}

export function getHighestXPTask(tasks) {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  return tasks.find(task => task.xp == getXpArray(tasks).reduce((a, b) => a > b ? b = a : b));
};

export function addXP(user, amount) {
  const newXp = user.xp + amount;
  const newObj = { ...user, xp: newXp }
  return newObj;
}

export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 30;
export const MAX_XP = XP_PER_LEVEL * MAX_LEVEL;
export const MIN_GOAL_DURATION_MONTHS = 1;
export const MAX_GOAL_DURATION_MONTHS = 12;
export const DAILY_QUEST_XP_LIMIT = 20;
export const MIN_DAILY_QUEST_XP = 1;
export const MAX_DAILY_QUEST_XP = 2;

export function getLocalDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDateOrdinal(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

export function getStreakAfterQuestCompletion(streak, lastCompletedDate, completedAt = new Date()) {
  const today = getLocalDateKey(completedAt);

  if (lastCompletedDate === today) {
    return { streak, lastCompletedDate };
  }

  const yesterday = new Date(completedAt);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    streak: lastCompletedDate === getLocalDateKey(yesterday) ? streak + 1 : 1,
    lastCompletedDate: today,
  };
}

export function calculateLevel(xp) {
  const totalXP = Math.max(0, xp);
  if (totalXP >= MAX_XP) return MAX_LEVEL;
  if (totalXP < XP_PER_LEVEL * 2) return 1;
  return Math.floor((totalXP - XP_PER_LEVEL * 2) / XP_PER_LEVEL) + 2;
}

export function getLevelProgress(xp) {
  const totalXP = Math.min(MAX_XP, Math.max(0, xp));
  const level = calculateLevel(totalXP);
  if (level === MAX_LEVEL) {
    return { level, xpInLevel: XP_PER_LEVEL, xpForLevel: XP_PER_LEVEL };
  }

  const levelStartXP = level === 1 ? 0 : level * XP_PER_LEVEL;
  const xpForLevel = level === 1 ? XP_PER_LEVEL * 2 : XP_PER_LEVEL;
  return { level, xpInLevel: totalXP - levelStartXP, xpForLevel };
}

export function getGoalTarget(goal, currentXP = 0, today = new Date()) {
  const goals = goal !== null && typeof goal === "object" ? goal : { durationMonths: goal };
  const durationMonths = goals.durationMonths;
  const months = Number.isFinite(durationMonths)
    ? Math.min(MAX_GOAL_DURATION_MONTHS, Math.max(MIN_GOAL_DURATION_MONTHS, Math.floor(durationMonths)))
    : MIN_GOAL_DURATION_MONTHS;
  const days = months * 30;
  const todayKey = getLocalDateKey(today);
  const startedOn = typeof goals.startedOn === "string" ? goals.startedOn : todayKey;
  const elapsedDays = Math.max(0, getDateOrdinal(todayKey) - getDateOrdinal(startedOn));
    const startingXP = goals.startedOn && Number.isFinite(goals.startingXP)
    ? Math.min(MAX_XP, Math.max(0, goals.startingXP))
    : Math.min(MAX_XP, Math.max(0, currentXP));
  const remainingXP = MAX_XP - startingXP;
  const baseDailyXP = Math.floor(remainingXP / days);
  const remainderXP = remainingXP % days;
  const dailyXP = elapsedDays < days
    ? baseDailyXP + (elapsedDays < remainderXP ? 1 : 0)
    : Math.min(remainingXP, DAILY_QUEST_XP_LIMIT);

  return { months, days, xp: MAX_XP, level: MAX_LEVEL, dailyXP, elapsedDays, startingXP };
}

export function getQuestXPDistribution(quests, dailyXP) {
  const totalWeight = quests.reduce((total, quest) => total + quest.xp, 0);
  if (totalWeight <= 0 || dailyXP <= 0) {
    return quests.map((quest) => ({ id: quest.id, xp: 0 }));
  }

  let accumulatedWeight = 0;
  return quests.map((quest) => {
    const startXP = Math.floor((dailyXP * accumulatedWeight) / totalWeight);
    accumulatedWeight += quest.xp;
    const endXP = Math.floor((dailyXP * accumulatedWeight) / totalWeight);
    return { id: quest.id, xp: endXP - startXP };
  });
}

export function getLevelTitle(level) {
  const titles = [
    "Beginner",
    "Novice",
    "Intermediate",
    "Skilled",
    "Advanced",
    "Expert",
    "Elite",
    "Master",
    "Legendary",
    "Extraordinary",
  ];
  const titleIndex = Math.min(titles.length - 1, Math.floor((Math.max(1, level) - 1) / 3));
  return titles[titleIndex];
}

export function groupByCategory(tasks) {
  const one = tasks.map(task => task.category);
  let newObj = {}
  for (let i = 0; i < one.length; i++) {
    const category = one[i];
    if (!newObj[category]) {
      newObj[category] = [];
    }

    newObj[category].push(
      tasks[i]
    );
  }
  return newObj;
}
export function getHour(minutes){
  const hourinFormat= minutes/60;
  const hour=hourinFormat.toFixed(2).split(".")[0]+"h "+hourinFormat.toFixed(2).split(".")[1]+"min";
  return hour;
}
