 import React from "react";
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems.jsx";
import { CirclePlus } from "lucide-react";

const SideBar = ({ sideBarOpen, setSideBarOpen }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${
        sideBarOpen ? "translate-x-0" : "max-sm:translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        {/* Logo + Name Container */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center ml-4 my-2 cursor-pointer gap-2"
        >
          <img src={assets.logo} alt="logo" className="w-16 h-16" />
          <h1 className="text-3xl font-extrabold tracking-wide">
            <span className="text-blue-500">Pl</span>
            <span className="text-red-500">ixa</span>
          </h1>
        </div>

        <hr className="border-gray-300 mb-8" />
        <MenuItems setSideBArOpen={setSideBarOpen} />

        <Link to="/create-post" className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg 
        bg-gradient-to-r from-indigo-500 to-purple-600
         hover:from-indigo-700 hover:to-purple-800 active: scale-95
          transition text-white cursor-pointer">
        <CirclePlus className="w-5 h-5 "/>
        Creater Post 
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
