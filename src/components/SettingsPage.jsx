import React, { useEffect, useState } from "react";
import DataTransferControls from "./DataTransferControls.jsx";
import ConfirmOverlay from "./ConfirmOverlay.jsx";
import AvatarSvg from "./AvatarSvg.jsx";
import { calculateLevel, getGoalTarget, getLevelTitle, MAX_XP, MIN_GOAL_DURATION_MONTHS, MAX_GOAL_DURATION_MONTHS } from "../utils/helperFunctions.js";
import { avatarOptions, themeOptions } from "../../data/data.js";

function SettingsPage({ initialState, ChangeUsername, onChangeAge, onChangeAvatar, onChangeGoals, onReset, onResetTracker, onToggleNotifications, onChangeNotificationTime, onChangeFeatures, onChangeTheme, onImportData, onExportData, onExportExcel }) {
    const currentTitle = getLevelTitle(calculateLevel(initialState.profile.xp));
    const goalTarget = getGoalTarget(initialState.goals, initialState.profile.xp);
    const [durationDraft, setDurationDraft] = useState(String(initialState.goals.durationMonths));
    const [confirm, setConfirm] = useState(null);

    useEffect(() => setDurationDraft(String(initialState.goals.durationMonths)), [initialState.goals.durationMonths]);

    function updateDuration(event) {
        const value = event.target.value;
        setDurationDraft(value);
        if (!/^\d+$/.test(value)) return;
        const durationMonths = Number(value);
        if (durationMonths >= MIN_GOAL_DURATION_MONTHS && durationMonths <= MAX_GOAL_DURATION_MONTHS) onChangeGoals({ durationMonths });
    }
    function finishDurationEdit() {
        const value = Number(durationDraft);
        if (!Number.isInteger(value) || value < MIN_GOAL_DURATION_MONTHS || value > MAX_GOAL_DURATION_MONTHS) setDurationDraft(String(initialState.goals.durationMonths));
    }

    const trackerLabels = {
        analytics: ["Analytics", "Productivity analytics will be hidden when disabled."],
        journal: ["Daily Journal", "Journal entries will be deleted and the tracker disabled."],
        mood: ["Mood Tracker", "Mood history will be deleted and the tracker disabled."],
        expenses: ["Expense Tracker", "Expenses, income and budget will be deleted and the tracker disabled."],
        calories: ["Calorie Tracker", "Calorie history will be deleted and the tracker disabled."],
    };

    return (
        <section className="page">
            <div className="page-heading"><div><h1>Settings</h1><p>Customize your Arise experience.</p></div></div>
            <div className="card settings-card">
                <div className="settings-section" id="profile">
                    <h2>Profile</h2>
                    <div className="settings-form-grid">
                        <label className="form-group"><span className="form-label">Profile name</span><input className="input" placeholder="Your name" value={initialState.profile.name} onChange={(event) => ChangeUsername(event.target.value)} /></label>
                        <label className="form-group"><span className="form-label">Age</span><input className="input" min="0" max="120" placeholder="Your age" type="number" value={initialState.profile.age || ""} onChange={(event) => onChangeAge(Number(event.target.value))} /></label>
                        <label className="form-group"><span className="form-label">Adventurer title</span><input className="input" value={currentTitle} readOnly /></label>
                        <label className="form-group settings-avatar"><span className="form-label">Profile avatar</span><div className="avatar-setting"><AvatarSvg value={initialState.profile.avatar} size={44} /><select className="select" aria-label="Profile avatar" value={initialState.profile.avatar || ""} onChange={(event) => onChangeAvatar(event.target.value)}><option value="">Default</option>{avatarOptions.map((avatar) => <option key={avatar.value} value={avatar.value}>{avatar.label}</option>)}</select></div></label>
                        <label className="form-group settings-goals"><span className="form-label">Goals</span><textarea className="input settings-textarea" placeholder="What would you like to achieve?" rows="3" value={initialState.goals.description} onChange={(event) => onChangeGoals({ description: event.target.value })}></textarea></label>
                        <label className="form-group settings-goal-duration"><span className="form-label">Time to achieve goal (months)</span><input className="input" type="text" inputMode="numeric" pattern="[0-9]*" min={MIN_GOAL_DURATION_MONTHS} max={MAX_GOAL_DURATION_MONTHS} value={durationDraft} onChange={updateDuration} onBlur={finishDurationEdit} /></label>
                    </div>
                    <p className="settings-goal-projection" role="status">Target: Level {goalTarget.level} · {goalTarget.xp} / {MAX_XP} XP in {goalTarget.days} days. Today's quest target: {goalTarget.dailyXP} XP; complete all quests each day.</p>
                </div>
                <div className="settings-section">
                    <h2>Appearance</h2>
                    <div className="setting-row"><div><h3>Theme</h3><p>Choose the color palette for your workspace.</p></div><select className="select settings-theme" aria-label="Theme" value={initialState.settings.theme || "rift"} onChange={(event) => onChangeTheme(event.target.value)}>{themeOptions.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}</select></div>
                </div>
                <div className="settings-section">
                    <h2>Features</h2>
                    <p>Enable optional tools. Resetting a tracker clears its data and disables it.</p>
                    <div className="feature-toggle-grid">
                        {Object.entries(trackerLabels).map(([key, [label, resetMessage]]) => (
                            <div className="setting-row feature-setting-row" key={key}>
                                <div><h3>{label}</h3><p>{resetMessage}</p></div>
                                <div className="feature-actions">
                                    {key !== "analytics" && <button className="btn btn-secondary tracker-reset-button" type="button" disabled={!initialState.settings.features?.[key]} onClick={() => setConfirm({ type:"tracker", key, title:`Reset ${label}?`, message:resetMessage })}>Reset</button>}
                                    <button className={"toggle " + (initialState.settings.features?.[key] ? "on" : "")} aria-label={"Toggle " + label} aria-pressed={Boolean(initialState.settings.features?.[key])} onClick={() => onChangeFeatures({ [key]: !initialState.settings.features?.[key] })}><span></span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <h2>Preferences</h2>
                    <div className="setting-row settings-data-row"><div><h3>Notifications</h3><p>Show a browser notification every day at your chosen time.</p></div><button className={`toggle ${initialState.settings.notifications ? "on" : ""}`} aria-label="Toggle notifications" aria-pressed={initialState.settings.notifications} onClick={onToggleNotifications}><span></span></button></div>
                    {initialState.settings.notifications && <label className="form-group notification-time-setting"><span className="form-label">Daily notification time</span><input className="input" type="time" value={initialState.settings.notificationTime || "09:00"} onChange={(event) => onChangeNotificationTime(event.target.value)} /></label>}
                </div>
                <div className="settings-section">
                    <h2>Data</h2>
                    <div className="setting-row"><div><h3>Backup your progress</h3><p>Export progress to Excel or JSON, or import a JSON backup.</p></div><DataTransferControls onImportFile={onImportData} onExportData={onExportData} onExportExcel={onExportExcel} /></div>
                </div>
                <div className="setting-row danger settings-reset-row">
                    <div><h3>Reset all progress</h3><p>Restore the original demo state. This cannot be undone.</p></div>
                    <button className="btn btn-secondary" onClick={() => setConfirm({ type:"all", title:"Reset all progress?", message:"All quests, habits, XP and tracker data will be replaced with the original demo state." })}>Reset</button>
                </div>
            </div>
            {confirm && <ConfirmOverlay title={confirm.title} message={confirm.message} confirmLabel="Reset" danger onClose={() => setConfirm(null)} onConfirm={() => { if (confirm.type === "all") onReset(); else onResetTracker(confirm.key); setConfirm(null); }} />}
        </section>
    );
}
export default SettingsPage;
