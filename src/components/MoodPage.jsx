import React, { useMemo, useState } from "react";
import ConfirmOverlay from "./ConfirmOverlay.jsx";
const moods=[{value:"great",label:"Great",icon:"😄"},{value:"good",label:"Good",icon:"🙂"},{value:"okay",label:"Okay",icon:"😐"},{value:"low",label:"Low",icon:"🙁"},{value:"rough",label:"Rough",icon:"😞"}];

function MoodPage({ initialState, onChange }) {
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=useState(today),[mood,setMood]=useState("good"),[note,setNote]=useState("");
  const [formOpen,setFormOpen]=useState(false),[logsOpen,setLogsOpen]=useState(true),[openDates,setOpenDates]=useState(null);
  const [editingId,setEditingId]=useState(null),[deleteId,setDeleteId]=useState(null);
  const groupedEntries=useMemo(()=>[...(initialState.settings.moodEntries||[])].sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt||b.id).localeCompare(String(a.createdAt||a.id))).reduce((g,e)=>{(g[e.date]??=[]).push(e);return g},{}),[initialState.settings.moodEntries]);

  function toggleDate(value){setOpenDates(prev=>{const next=new Set(prev||[]);const first=Object.keys(groupedEntries)[0];if(prev===null){next.add("___collapsed_first___");}else if(next.has("___collapsed_first___")&&value===first){next.delete("___collapsed_first___");next.add(value);}else if(next.has(value))next.delete(value);else next.add(value);return next})}
  function resetForm(){setDate(today);setMood("good");setNote("");setEditingId(null)}
  function saveMood(event){event.preventDefault();const entries=initialState.settings.moodEntries||[];if(editingId){onChange({moodEntries:entries.map(e=>e.id===editingId?{...e,date,mood,note:note.trim(),updatedAt:new Date().toISOString()}:e)});}else{onChange({moodEntries:[{id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date,mood,note:note.trim(),createdAt:new Date().toISOString()},...entries]});}resetForm();}
  function editMood(entry){setEditingId(entry.id);setDate(entry.date);setMood(entry.mood);setNote(entry.note||"");setFormOpen(true);}
  function deleteMood(){onChange({moodEntries:(initialState.settings.moodEntries||[]).filter(e=>e.id!==deleteId)});setDeleteId(null);}
  return <section className="page tracker-page">
    <div className="page-heading"><div><h1>Mood Tracker</h1><p>Check in with yourself and notice patterns over time.</p></div></div>
    <div className="tracker-grid tracker-layout">
      <div className="card tracker-form tracker-collapsible">
        <button type="button" className="tracker-card-header" onClick={()=>setFormOpen(v=>!v)} aria-expanded={formOpen}><h2>{editingId?"Edit check-in":"Daily check-in"}</h2><span className="tracker-card-icon">{formOpen?"−":"+"}</span></button>
        {formOpen&&<form className="tracker-form-body" onSubmit={saveMood}>
          <label className="form-group"><span className="form-label">Date</span><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
          <div className="form-group"><span className="form-label">How are you feeling?</span><div className="mood-options">{moods.map(item=><button key={item.value} type="button" className={`mood-option ${mood===item.value?"selected":""}`} onClick={()=>setMood(item.value)}><span>{item.icon}</span>{item.label}</button>)}</div></div>
          <label className="form-group"><span className="form-label">Note (optional)</span><textarea className="input tracker-textarea" rows="5" placeholder="What is influencing your mood?" value={note} onChange={e=>setNote(e.target.value)}/></label>
          <div className="modal-actions"><button className="btn btn-primary" type="submit">{editingId?"Save changes":"Save mood"}</button>{editingId&&<button className="btn btn-secondary" type="button" onClick={resetForm}>Cancel edit</button>}</div>
        </form>}
      </div>
      <div className="card tracker-list tracker-collapsible">
        <button type="button" className="tracker-card-header" onClick={()=>setLogsOpen(v=>!v)} aria-expanded={logsOpen}><h2>Mood history</h2><span className="tracker-card-icon">{logsOpen?"⌃":"⌄"}</span></button>
        {logsOpen&&<>{Object.keys(groupedEntries).length===0?<p className="tracker-empty">No mood check-ins yet.</p>:Object.keys(groupedEntries).map((date,index)=>{const isOpen=openDates===null?index===0:openDates.has(date);return <div className={`tracker-date-group ${isOpen?"open":"collapsed"}`} key={date}><button type="button" className="tracker-date-heading" onClick={()=>toggleDate(date)} aria-expanded={isOpen}><span><span className="date-chevron">{isOpen?"⌄":"›"}</span>{date}</span><span>{groupedEntries[date].length} {groupedEntries[date].length===1?"entry":"entries"}</span></button>{isOpen&&groupedEntries[date].map(entry=>{const selected=moods.find(item=>item.value===entry.mood)||moods[2];return <article className="tracker-item" key={entry.id}><div className="tracker-item-head"><div><strong>{selected.icon} {selected.label}</strong><span>Added {entry.createdAt?new Date(entry.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Earlier"}</span></div><div className="tracker-item-actions"><button type="button" className="btn btn-secondary" onClick={()=>editMood(entry)}>Edit</button><button type="button" className="btn btn-secondary tracker-delete" onClick={()=>setDeleteId(entry.id)}>Delete</button></div></div>{entry.note&&<p>{entry.note}</p>}</article>})}</div>})}</>}
      </div>
    </div>
    {deleteId&&<ConfirmOverlay title="Delete mood entry?" message="This mood check-in will be permanently removed." confirmLabel="Delete" danger onClose={()=>setDeleteId(null)} onConfirm={deleteMood}/>}
  </section>;
}
export default MoodPage;