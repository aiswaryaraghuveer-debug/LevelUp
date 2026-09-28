import React from "react";
import AppHeader from "./components/AppHeader";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import "./styles.css";
import {navItems} from "../data/data.js";

function App(){
  return (
    <div>
      <AppHeader />
      <div className="main">
        <Sidebar navItems={navItems} />
        <HomePage />
      </div>  
    </div>
  );
}
export default App;