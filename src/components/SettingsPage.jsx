import React,{useState} from "react"
import DataTransferControls from "./DataTransferControls.jsx";
function SettingsPage({initialState,ChangeUsername,onReset,onToggleNotifications,onChangeTheme,onImportData}) {
    const [age,setAge]=useState(0)
    const [goals,setGoals]=useState("")

    function resetSettings() {
        onReset();
        setAge(0);
        setGoals("");
    }
    return (
        <>
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Settings</h1>
                        <p>Customize your LEVELUP experience.</p>
                    </div>
                </div>
                <div className="card settings-card">
                    <div className="settings-section" id="profile">
                        <h2>Profile</h2>
                        <div className="settings-form-grid">
                            <label className="form-group">
                                <span className="form-label">Profile name</span>
                                <input className="input" placeholder="Your name" value={initialState.profile.name} onChange={(e)=>ChangeUsername(e.target.value)}/>
                            </label>
                            <label className="form-group">
                                <span className="form-label">Age</span>
                                <input className="input" min="0" max="120" placeholder="Your age" type="number" value={age} onChange={(e)=>setAge(e.target.value)}/>
                            </label>
                            {/* <label className="form-group settings-goals">
                                <span className="form-label">Adventurer title</span>
                                <input className="input" placeholder="Your title" value="Rookie Adventurer" />
                            </label> */}
                            <label className="form-group settings-goals">
                                <span className="form-label">Goals</span>
                                <textarea className="input settings-textarea" placeholder="What would you like to achieve?" rows="3" value={goals} onChange={(e)=>setGoals(e.target.value)}></textarea>
                            </label>
                        </div>
                    </div>
                    <div className="settings-section">
                        <h2>Appearance</h2>
                        <div className="setting-row"><div>
                            <h3>Theme</h3>
                            <p>Choose the color palette for your workspace.</p>
                        </div>
                            <select className="select settings-theme" aria-label="Theme" value={initialState.settings.theme || "rose"} onChange={(event) => onChangeTheme(event.target.value)}>
                                <option value="rose">Rose</option>
                                <option value="ocean">Ocean</option>
                                <option value="forest">Forest</option>
                            </select>
                        </div>
                    </div>
                    <div className="settings-section">
                        <h2>Preferences</h2>
                        <div className="setting-row">
                            <div>
                                <h3>Notifications</h3>
                                <p>Show productivity reminders.</p>
                            </div>
                            <button className={`toggle ${initialState.settings.notifications ? "on" : ""}`} aria-label="Toggle notifications" aria-pressed={initialState.settings.notifications} onClick={onToggleNotifications}>
                                <span></span>
                            </button>
                        </div>
                    </div>
                    <div className="settings-section">
                        <h2>Data</h2>
                        <div className="setting-row">
                            <div>
                                <h3>Backup your progress</h3>
                                <p>Import a LEVELUP JSON backup.</p>
                            </div>
                            <DataTransferControls showExport={false} onImportFile={onImportData} />
                        </div>
                    </div>
                    <div className="setting-row danger">
                        <div>
                            <h3>Reset demo data</h3>
                            <p>Restore the original portfolio demo state.</p>
                        </div>
                        <button className="btn btn-secondary" onClick={resetSettings}>Reset</button>
                    </div>
                </div>
            </section>
        </>
    )
}
export default SettingsPage;