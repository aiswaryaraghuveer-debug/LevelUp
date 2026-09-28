# 7-Day LEVELUP React + JavaScript Assignment

Target: about 3 focused hours per day. The goal is not to memorize React APIs; it is to be able to explain why the project is structured this way.

## App context and data model

LEVELUP is a frontend-only productivity RPG. A user turns real-life goals into quests, habits, and focus sessions. Completing work rewards XP and coins, XP determines the user's level, and streaks, analytics, and achievements make progress visible. The app currently persists its state in `localStorage`; there is no backend or authentication.

Use `src/data/data.js` as the source of truth for the starting data:

- `profile`: `{ name, title, xp, coins, streak }`. Level and progress are derived from `xp`; they should not be stored as separate values.
- `quests`: `{ id, title, category, xp, completed }`. The current categories are Health, Learning, Fitness, Personal, and Productivity.
- `habits`: `{ id, name, icon, completed }`. `completed` is a seven-item boolean array representing the displayed week.
- `focusSessions` and `focusMinutes`: totals used by Focus, Analytics, and Achievements.
- `weeklyXP`: seven daily XP values used by the analytics view.
- `settings`: currently includes `notifications` and `compact`.
- `achievements`: definitions with an `id`, display information, a `type`, and a target `value`. Progress must be calculated from current state.
- `navItems`: the expected sidebar labels and routes: Dashboard, Quests, Habits, Focus, Analytics, Achievements, and Settings.

When an assignment says “update XP,” follow the app rule: completing a quest adds its `xp` and half that amount in coins; completing a focus session adds `minutes * 2` XP and `minutes` coins. Toggling an item back should reverse the reward. Keep state updates immutable and avoid duplicating derived values such as level, completion rate, or achievement progress.

For each project checkpoint, test both the normal path and the edge case where there is no data. Keep the existing visual direction: a warm pink/orange/cream productivity dashboard that remains usable on small screens.

## Day 1 — JavaScript + React foundations

### JavaScript — 60 min
Create a `practice/day1.js` file and solve these without React:

1. `getCompletedTasks(tasks)` using `filter`.
2. `getTaskTitles(tasks)` using `map`.
3. `getTotalXP(tasks)` using `reduce`.
4. `getHighestXPTask(tasks)` using `reduce` or `sort`.
5. `addXP(user, amount)` without mutating `user`.
6. `calculateLevel(xp)`.
7. `groupByCategory(tasks)` using `reduce`.

Use small example arrays that resemble the real quest objects in `src/data/data.js`. Decide what an empty array should return for each function, and document that decision in a short note beside your practice code.

#### What this assignment is asking you to do

- `getCompletedTasks(tasks)`: return only quests whose `completed` value is `true`, without changing the original array.
- `getTaskTitles(tasks)`: create a new array containing each quest's `title`, in the same order.
- `getTotalXP(tasks)`: add every quest's `xp` value. An empty list should produce `0`, not `NaN`.
- `getHighestXPTask(tasks)`: return the complete quest object with the greatest XP reward so its title and category remain available. Decide what to return when there are no quests.
- `addXP(user, amount)`: return a new user object with increased XP while preserving the original object.
- `calculateLevel(xp)`: convert total XP into a level using one consistent rule, including clear behavior at level boundaries.
- `groupByCategory(tasks)`: return an object whose keys are categories such as `Health` and `Learning`, with each key containing its matching quests.

The purpose is to learn how to transform LEVELUP's quest data before React renders it. Write calls for normal data, an empty array, and a quest with `0` XP so the behavior is explicit.

### React — 60 min
Build:
- `App`
- `Sidebar`
- `Header`
- `StatCard`
- `QuestCard`
- `XPBar`

Practice:
- JSX
- props
- children
- lists and keys
- conditional rendering
- component composition

Pass quest/profile values through props rather than importing the data directly inside every component. Give repeated collections stable keys, and make the XP bar receive enough information to show current XP, level, and progress without owning the profile state.

#### What this assignment is asking you to do

Create small components with one clear responsibility. `App` composes the page, `Sidebar` displays navigation, `Header` displays identity or controls, `StatCard` displays one metric, `QuestCard` displays one quest, and `XPBar` displays progress. Render several quests by mapping over an array and pass each quest into `QuestCard` as a prop. Use conditional rendering to show completed and incomplete quests differently.

The goal is to practice parent-to-child data flow, stable list keys, and composing a dashboard from reusable pieces rather than writing one large component.

### Project — 60 min
Recreate the dashboard shell:
- fixed sidebar
- header/search
- level card
- four stat cards
- today's quests
- responsive CSS

Checkpoint: you can explain why each repeated UI element is a component.

Additional check: identify which values are source data (`xp`, quests) and which are derived UI values (level, progress, completed quest count).

#### What success looks like

The page should look like a static version of the LEVELUP dashboard using the sample values from `data.js`. Resize the browser and confirm that the sidebar, cards, and quest list remain usable. Be able to identify where each repeated component receives its data.

---

## Day 2 — State, events and forms

### JavaScript — 45 min
Implement:
- `toggleTask(tasks, id)`
- `addTask(tasks, task)`
- `updateTask(tasks, id, updates)`
- `deleteTask(tasks, id)`
- `searchTasks(tasks, term)`
- `sortTasks(tasks, field, direction)`

Do not mutate the original array.

Use the same quest shape as the app: preserve unrelated fields when updating a quest, keep IDs stable, and return a new array even when the operation changes one item. Decide how search handles blank terms and how sorting handles equal or missing values.

#### What this assignment is asking you to do

- `toggleTask`: find a quest by ID and return a new list with only that quest's `completed` value flipped.
- `addTask`: append a new quest without changing the existing list. Include the fields the UI needs: ID, title, category, XP, and completion status.
- `updateTask`: merge selected updates into one quest while preserving fields that were not updated.
- `deleteTask`: return a list that excludes the matching ID. Deleting an unknown ID should leave the data equivalent to the original.
- `searchTasks`: return quests whose titles match the search term, with a deliberate choice about case and whitespace.
- `sortTasks`: return a newly sorted list by a field such as title or XP. Do not sort the input array in place.

These functions model the operations users perform on the Quests page. Test that the input array is unchanged after every call.

### React — 75 min
Learn:
- `useState`
- event handlers
- controlled inputs
- lifting state
- derived state

Build:
- Add Quest modal
- quest completion
- quest deletion
- search/filter
- XP update

The completion action must be reversible. Completing a quest changes `completed`, adds the quest reward to XP and coins, and toggling it again removes those same rewards. Avoid letting a component calculate a second, conflicting version of that rule.

#### What this assignment is asking you to do

Build a controlled form whose values live in React state. A valid submission should create a quest and close the modal. A quest click should update completion and profile rewards. Search and filters should change what is displayed without destroying the source list, and delete should remove the selected quest.

This exercise is about event flow: an input or button triggers a handler, the handler updates state, and React renders the result. Keep completed counts and filtered lists derived from current state instead of storing duplicate copies.

### Project — 60 min
Make the dashboard genuinely interactive.

Checkpoint:
1. Add a quest.
2. Complete it.
3. XP increases.
4. Coins increase.
5. Level/progress updates.
6. Delete it.

Also verify that deleting a completed quest does not accidentally award or remove XP a second time, and that submitting a blank title is rejected without closing the modal.

#### What success looks like

Without refreshing, create a quest, find it through search, complete it once, see XP and coins change, undo completion, and delete it. Invalid form input should give useful feedback and should not create an empty quest.

---

## Day 3 — Effects, async JavaScript and persistence

### JavaScript — 60 min
Practice:
- Promise
- async/await
- try/catch
- `fetch`
- loading/error states

Use a public API such as `https://dummyjson.com/todos` for a separate exercise.

Also implement:
- `debounce(fn, delay)`
- `formatDate(date)`

For the debounce exercise, explain what happens to the timer when a new search term arrives. For dates, choose a consistent display format and be explicit about whether the calculation uses local time or UTC.

#### What this assignment is asking you to do

Use `fetch` to represent loading, success, and failure while requesting the practice API. `async/await` should make the sequence readable, and `try/catch` should prevent a failed request from crashing the exercise. This API work is separate from LEVELUP's local data and is only for practicing asynchronous control flow.

`debounce` should delay a function until calls stop arriving for the chosen delay, which is useful for search input. `formatDate` should turn a `Date` into predictable text for a last-active label or activity history.

### React — 60 min
Learn:
- `useEffect`
- dependency arrays
- cleanup
- browser storage

Build:
- `useLocalStorage`
- persistent quests/habits/settings

The storage key should have a versioned name such as `levelup-state-v1`. Handle invalid or missing JSON by falling back to the initial data, and do not access `localStorage` in a way that crashes rendering in a restricted environment.

#### What this assignment is asking you to do

Create a reusable hook that reads an initial value from browser storage, returns the current value, and writes changes back when that value changes. Use it for quests, habits, and settings so a refresh restores the user's work. Serialize objects when saving, parse them when loading, and fall back safely when storage contains malformed JSON or is unavailable.

### Project — 60 min
Add:
- daily streak
- last-active date
- persistence after refresh
- reset demo data

Checkpoint: refresh the browser and your data survives.

Test persistence for a quest, a habit day, and a setting separately. Test reset behavior as well: reset should restore the original shape and values from `initialState`.

#### What success looks like

Complete a quest, toggle one habit day, change a setting, refresh the page, and confirm all three changes return. Then reset the demo data and confirm the original sample quests, habits, profile values, and settings are restored.

---

## Day 4 — Context + reducer architecture

### JavaScript — 45 min
Write a pure reducer:

```js
appReducer(state, action)
```

Support:
- `ADD_QUEST`
- `COMPLETE_QUEST`
- `DELETE_QUEST`
- `TOGGLE_HABIT`
- `ADD_XP`
- `RESET_DATA`

Keep the reducer pure: it should calculate and return the next state, not write to storage or perform browser work. For quest completion, use the quest's own reward and make the action safe when its ID no longer exists.

#### What this assignment is asking you to do

Write one predictable function that receives the current state and an action object and returns the next state. `ADD_QUEST` adds a new incomplete quest, `COMPLETE_QUEST` changes completion and applies its reward, `DELETE_QUEST` removes a quest, `TOGGLE_HABIT` changes one day in one habit, `ADD_XP` changes the profile reward, and `RESET_DATA` returns the initial data. Each case should preserve unrelated state and return new objects or arrays for changed data.

The reducer is where business rules belong. Components should describe what happened by dispatching an action; they should not independently decide how many coins a quest is worth.

### React — 75 min
Learn:
- `useReducer`
- `createContext`
- `useContext`
- provider patterns
- avoiding prop drilling

Move the app state into `AppContext`.

#### What this assignment is asking you to do

Create a provider around the app that makes `state` and `dispatch` available to any page or component that needs them. Use `useReducer` for state transitions and `useContext` for access. A small `useApp` helper can provide a clear error when a consumer is rendered outside the provider.

### Project — 60 min
Make Dashboard, Quests and Habits read/write the same global state.

The shared provider should expose the current state and a dispatch function. Pages may derive their own filtered lists and summary values, but they should dispatch domain actions rather than mutate context state directly.

Checkpoint: no page should need to pass quest state through several component levels.

Trace one interaction from click to reducer action to the updated Dashboard and Quests views. That trace is the practical test that the provider owns the right boundary.

#### What success looks like

Completing a quest on the Quests page immediately changes its status and the profile summary shown on the Dashboard. Toggling a habit updates the same habit data wherever it is displayed. No component should need a long chain of props merely to forward global state.

---

## Day 5 — Routing + reusable pages

### JavaScript — 45 min
Practice:
- Date methods
- `some`
- `every`
- `find`
- `findIndex`
- `flatMap`
- `Set`
- `Object.entries`
- destructuring/spread

Build:
- `getWeeklyStats`
- `getCompletionRate`
- `getHabitStreak`

Use the existing seven-day habit arrays and `weeklyXP` values. Define how an empty week behaves, whether percentages are rounded, and whether a streak means the latest consecutive run or the longest run in the week.

#### What this assignment is asking you to do

Practice choosing the right array method for a question about progress. Use `some` or `every` for yes/no checks, `find` and `findIndex` for locating records, `flatMap` for flattening nested values, `Set` for unique categories, and `Object.entries` for iterating grouped statistics. The weekly helpers should consume existing state and return values that analytics cards or charts can render directly.

### React — 75 min
Learn:
- React Router
- `Link`
- `NavLink`
- `useNavigate`
- route layouts
- route parameters

Create:
- `/dashboard`
- `/quests`
- `/habits`
- `/focus`
- `/analytics`
- `/achievements`
- `/settings`

### Project — 60 min
Complete the Habits page and navigation.

Checkpoint: every sidebar item changes the URL and page without a full reload.

Confirm that the root route maps to Dashboard, each `navItems` path renders the intended page, and navigation remains available on narrow screens.

#### What this assignment is asking you to do

Configure client-side routes so navigation changes the visible page without a full browser reload. Use `Link` or `NavLink` for sidebar navigation, use route parameters when a page needs a selected record, and keep the shared layout visible around the routed page. Active navigation styling should follow the current URL.

---

## Day 6 — Advanced React + custom hooks

### JavaScript — 60 min
Solve:
1. `createXPTracker()` closure.
2. `memoize(fn)`.
3. `once(fn)`.
4. `withLogging(fn)`.
5. `debounce(fn, delay)`.
6. `throttle(fn, delay)`.

Then explain closures in your own words.

For each wrapper, preserve the original function's arguments and return value. Consider what happens when a debounced or throttled function is cancelled, and write at least one example that demonstrates the timing difference.

#### What this assignment is asking you to do

Implement higher-order functions that receive another function and return a new function. `createXPTracker` should keep private XP state through a closure. `memoize` should reuse a previous result for the same input, `once` should allow one successful call, and `withLogging` should add logging without changing the wrapped function's result. `debounce` waits until calls stop, while `throttle` limits how often calls can run.

### React — 60 min
Learn:
- `useRef`
- `useMemo`
- `useCallback`
- custom hooks
- effect cleanup

Build:
- `useTimer`
- `useDebounce`
- keyboard shortcut handling
- focus input with a ref

The timer should clean up its interval when paused or unmounted. A completed work session should dispatch one `FOCUS_COMPLETE` action with the session length; avoid dispatching repeatedly while the timer is at zero.

#### What this assignment is asking you to do

Use `useRef` for values that must persist between renders without causing a render, such as an input element or timer bookkeeping. Use a custom `useTimer` hook to hide interval setup, pause, reset, and cleanup. Use `useDebounce` to avoid filtering on every keystroke, and remove keyboard listeners when the component unmounts.

### Project — 60 min
Build Focus Mode:
- 25:00 work timer
- 05:00 break
- start/pause/reset
- session counter
- completed focus session gives XP

Add command palette:
- `Ctrl/Cmd + K`
- search commands
- navigate to pages
- open Add Quest

Checkpoint: you can explain when NOT to use `useMemo` and `useCallback`.

Use memoization only when it prevents a demonstrated expensive calculation or avoids a meaningful child re-render. Do not use it as a substitute for correct state ownership or immutable updates.

#### What success looks like

Focus Mode can switch between a 25-minute work session and a 5-minute break, pause without losing time, reset correctly, and count one completed session. `Ctrl/Cmd + K` opens the command palette, typing filters commands, and selecting a command navigates or opens the quest modal. The interface remains usable from the keyboard.

---

## Day 7 — Analytics, performance and portfolio polish

### JavaScript — 45 min
Without looking at old code, implement:

- `calculateLevel`
- `calculateXPProgress`
- `calculateStreak`
- `calculateCompletionRate`
- `getWeeklyXP`
- `getMostCompletedHabit`
- `generateDashboardStats`

Connect each helper to a visible product question: What level is the user? How much XP remains? How consistent were they? Which habit is strongest? Which numbers belong in the four Dashboard stat cards? Handle zero quests, zero minutes, and empty habit data without `NaN` or misleading percentages.

#### What this assignment is asking you to do

Rebuild the core calculations as reusable, independently testable functions. `calculateLevel` maps XP to a level, `calculateXPProgress` returns progress toward the next level, `calculateStreak` reads consecutive habit activity, `calculateCompletionRate` compares completed quests with total quests, `getWeeklyXP` prepares daily values, `getMostCompletedHabit` identifies the strongest habit, and `generateDashboardStats` assembles the summary metrics needed by the Dashboard.

### React — 75 min
Build:
- Analytics
- achievement unlocking
- empty/loading states
- error boundaries as an exercise
- accessibility checks
- responsive states

For accessibility, check labels, keyboard access, visible focus, button names, dialog behavior, color contrast, and meaningful empty states. Loading and error states should explain what the user can do next without relying only on color.

#### What this assignment is asking you to do

Turn the remaining data and calculations into usable pages. Analytics should make weekly XP and completion behavior understandable. Achievements should compare each definition's target with current progress and distinguish locked, in-progress, and unlocked states. Empty states should appear when a user has no quests or activity, while an error boundary should keep one broken render from taking down the entire interface.

### Project — 60 min
Polish:
- mobile layout
- hover/focus states
- modal animation
- command palette
- empty states
- README screenshots
- GitHub Pages/Vercel deployment

Before deployment, verify the production build, refresh behavior on a nested route, localStorage behavior after a new release, and that the app still works without network requests.

#### What this assignment is asking you to do

Treat the final hour as a product-quality pass. Check the layout at phone and desktop widths, make interactive states visible, finish modal and command-palette behavior, provide useful empty states, and capture screenshots that explain the finished project. Then build and deploy the app, checking that assets, routes, and browser persistence work in the deployed version.

Final interview exercise:
Explain:
1. Why Context + reducer?
2. Where is state persisted?
3. Which state is derived?
4. Why are keys required?
5. Where would `useMemo` help?
6. What would you change if the app had 100,000 quests?
7. How would you replace localStorage with an API?
8. How would you split the app into feature folders?

Use concrete examples from this project when answering. For example, distinguish source state from values returned by `getLevelProgress`, explain why the reducer owns reward calculations, and identify which data would need server-side authority in a multi-device version.

#### What this assignment is asking you to demonstrate

Answer using the code you built, not definitions copied from documentation. Explain the tradeoffs: Context avoids passing shared state through unrelated components, the reducer centralizes transitions, localStorage provides browser persistence, and derived values can be recalculated from source state. For the scale question, discuss pagination, server-side storage, query caching, and list virtualization rather than only adding more components.

## Final standard

By the end you should be able to build a smaller version from a blank Vite project without looking at this repository.
