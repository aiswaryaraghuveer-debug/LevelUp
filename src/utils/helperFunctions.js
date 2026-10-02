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

export function calculateLevel(xp) {
  if (xp == 0) return 1;
  return Math.ceil(xp / 200);
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
