 import React, { useState } from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

      {/* Main Content */}
      {/* ✅ Adjusted top padding to exactly match header height */}
      <div className="flex-1 bg-slate-50 overflow-y-auto sm:pt-0 pt-[48px]">
        <Outlet />
      </div>

      {/* ✅ Transparent Fixed Header Bar */}
      <div className="fixed top-0 left-0 w-full h-12 bg-white/40 backdrop-blur-md border-b border-gray-200 
                      flex items-center justify-between px-4 z-50 sm:hidden">
        {/* Logo (Left Side) */}
        <h1 className="text-lg font-extrabold tracking-wide">
          <span className="text-blue-500">Pl</span>
          <span className="text-red-500">ixa</span>
        </h1>

        {/* Menu / Close Icon (Right Side) */}
        {sideBarOpen ? (
          <X
            onClick={() => setSideBarOpen(false)}
            className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-600 transition"
          />
        ) : (
          <Menu
            onClick={() => setSideBarOpen(true)}
            className="w-7 h-7 text-gray-700 cursor-pointer hover:text-blue-600 transition"
          />
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
