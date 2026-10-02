import React,{useState} from "react";
function AddNewQuestOverlay({ onClose,onAddQuest }) {
    const closeOverlay = onClose;
    const [newQuestTitle,setNewQuestTitle]=useState("");
     const [newQuestCategory,setNewQuestCategory]=useState("");
      const [newQuestXp,setNewQuestXp]=useState(0);
      function addQuestToList(event) {
    event.preventDefault();

    onAddQuest({
      id: Date.now(),
      title: newQuestTitle.trim(),
      category: newQuestCategory,
      xp: Number(newQuestXp),
      completed: false,
    });

    onClose();
  }
    return (
        <>
            <div className="modal-overlay"><div className="modal"><div className="modal-title"><h2>Create a Quest</h2><button className="icon-button" onClick={closeOverlay}>×</button></div><form><div className="form-group"><label className="form-label">Quest title</label>
                <input className="input" placeholder="e.g. Practice React for 30 minutes" value={newQuestTitle}  onChange={(e)=>setNewQuestTitle(e.target.value)} /></div><div className="form-group"><label className="form-label">Category</label><select className="select" value={newQuestCategory}  onChange={(e)=>setNewQuestCategory(e.target.value)} ><option>Learning</option><option>Health</option><option>Fitness</option><option>Personal</option><option>Productivity</option></select></div><div className="form-group"><label className="form-label">XP reward</label>
                    <input className="input" min="10" max="500" step="10" type="number" value={newQuestXp}  onChange={(e)=>setNewQuestXp(e.target.value)} /></div>
                    <button className="btn btn-primary full" type="submit" onClick={addQuestToList}>Create Quest</button>
                    </form></div></div>
        </>

    )
}
export default AddNewQuestOverlay;