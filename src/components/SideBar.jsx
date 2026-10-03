import React from "react";
import { NavLink } from "react-router-dom";
function SideBar({ navItems }) {
    return (
        <div className="sidebar">
            <nav >
                <div className="brand">
                    <div className="brand-crown">♛</div>
                    <div className="brand-name">LEVELUp
                    </div>
                    <div className="brand-tagline">Small steps. Big dreams</div>
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
