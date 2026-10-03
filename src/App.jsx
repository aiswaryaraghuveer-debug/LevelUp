import React from "react";
import AppHeader from "./components/AppHeader";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";
import "./styles.css";
import { navItems } from "../data/data.js";

function App() {
  return (
    <div>
      <SideBar navItems={navItems} />

      <div className="main">
        <AppHeader />
        <HomePage />
      </div>
    </div>
  );
}
export default App;