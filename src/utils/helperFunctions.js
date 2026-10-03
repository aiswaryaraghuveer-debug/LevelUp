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
export const DAILY_QUEST_XP_LIMIT = 20;
export const MIN_DAILY_QUEST_XP = 1;
export const MAX_DAILY_QUEST_XP = 2;

export function getStreakAfterQuestCompletion(streak, lastCompletedDate, completedAt = new Date()) {
  const getDateKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const today = getDateKey(completedAt);

  if (lastCompletedDate === today) {
    return { streak, lastCompletedDate };
  }

  const yesterday = new Date(completedAt);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    streak: lastCompletedDate === getDateKey(yesterday) ? streak + 1 : 1,
    lastCompletedDate: today,
  };
}

export function calculateLevel(xp) {
  return Math.min(MAX_LEVEL, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1);
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
