//helperFunctions.js

export function getCompletedTasks(tasks) {
  const completedTasks = tasks.filter(task => task.completed);
  return completedTasks;
};

export function getTaskTitles(tasks){
    const titleArray=tasks.map(task=>task.title)
    return titleArray
}

export function getXpArray(tasks){
        const xpArray=tasks.map(task=>task.xp)
        return xpArray;
    };

export function getTotalXP(tasks){
    if(!tasks || tasks.length === 0){
        return 0;
    }
    return getXpArray(tasks).reduce((a,b)=>a+b,0);
}

export  function getHighestXPTask(tasks){
  if (!tasks || tasks.length === 0) {
    return null;
  }
     return tasks.find(task=>task.xp==getXpArray(tasks).reduce((a,b)=>a>b?b=a:b));
 };

export function addXP(user, amount){
  const newXp=user.xp+amount;
  const newObj= {...user,xp:newXp}
  return newObj;
}

export function calculateLevel(xp){
    if (xp==0) return 1;
  return Math.ceil(xp/100);
  }

export function groupByCategory(tasks){
    const one=tasks.map(task=>task.category);
    let newObj={}
    for(let i=0;i<one.length; i++){
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
