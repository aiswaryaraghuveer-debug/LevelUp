import React from "react";
function SideBar({ navItems }) {
    return (
        <div className="sidebar">
            <nav >
                 <div className="brand">
                    <div className="brand-crown     ">♛</div>
                <div className="brand-name">LEVELUp
                </div>
                <div className="brand-tagline">Small steps. Big dreams</div>
            </div>
                <div className="nav">
                    {navItems.map((item) => (
                        <div className="nav-item" key={item.label}>
                            <a className="nav-icon" href={item.href}>{item.icon}</a>
                            <span>{item.label}</span>
                        </div>

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
