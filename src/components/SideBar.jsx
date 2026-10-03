import React from "react";
import { NavLink } from "react-router-dom";
function SideBar({ navItems }) {
    return (
        <div className="sidebar">
            <nav >
                <div className="brand">
                    <svg className="brand-icon" viewBox="0 0 48 48" aria-hidden="true">
                        <path className="brand-icon-frame" d="M10 32C5 22 10 10 21 8c10-2 18 4 18 15" />
                        <path className="brand-icon-arrow" d="M15 36h18M24 34V17m-7 7 7-7 7 7" />
                        <path className="brand-icon-spark" d="m36 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
                    </svg>
                    <div className="brand-name">Arise</div>
                    <div className="brand-tagline">Rise through every level</div>
                </div>
                <div className="nav">
                    {navItems.map((item) => (
                         <NavLink to={item.path} className="nav-item" key={item.path}>
                           
                                <div className="nav-icon">{item.icon}</div>
                                <span>{item.label}</span>
                            
                        </NavLink>
                    ))}
                </div>
                <div className="sidebar-quote">
                    <div className="quote-art"></div>
                    <p>You're not just completing tasks.</p>
                    <strong>You're building the life you want.</strong>
                    <span>♥</span>
                </div>
            </nav>
        </div>
    );
}
export default SideBar;
