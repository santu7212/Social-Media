 import React from "react";
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets.js";

const MenuItems = ({ setSideBArOpen }) => {
  return (
    <div className="px-6 text-slate-700 space-y-1 font-medium">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setSideBArOpen(false)}
          className={({ isActive }) =>
            `px-3.5 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-all
             ${
               isActive
                 ? "bg-gradient-to-r from-blue-200 to-red-200 text-slate-900 shadow-sm"
                 : "text-slate-700"
             }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
