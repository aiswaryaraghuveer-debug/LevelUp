import React from "react";
import AppHeader from "./components/AppHeader";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import "./styles.css";
import {navItems} from "../data/data.js";

function App(){
  return (
    <div>
       <Sidebar navItems={navItems} />
      
      <div className="main">
       <AppHeader />
        <HomePage />
      </div>  
    </div>
  );
}
export default App;