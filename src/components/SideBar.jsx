import React from "react";
function SideBar({navItems}){
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
export default SideBar;
               