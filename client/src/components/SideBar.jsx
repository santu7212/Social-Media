 import React from "react";
import { assets, dummyUserData } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems.jsx";
import { CirclePlus, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const SideBar = ({ sideBarOpen, setSideBarOpen }) => {
  const navigate = useNavigate();
  const user =  useSelector((state)=>state.user.value)
  const { signOut } = useClerk();

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

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg
          bg-gradient-to-r from-blue-500 to-red-500
          active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-slate-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium text-slate-800">{user.full_name}</h1>
            <p className="text-sm text-slate-500">@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
