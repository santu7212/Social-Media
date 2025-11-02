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
      <div className="flex-1 bg-slate-50 overflow-y-auto sm:pt-0 pt-14">
        {/* ↑ pt-14 adds space at top only on mobile so menu doesn't block content */}
        <Outlet />
      </div>

      {/* Mobile Menu Button (top-left, fixed, no scroll) */}
      {sideBarOpen ? (
        <X
          className="fixed top-2 left-3 z-50 text-gray-700 sm:hidden w-8 h-8"
          onClick={() => setSideBarOpen(false)}
        />
      ) : (
        <Menu
          className="fixed top-2 left-3 z-50 text-gray-700 sm:hidden w-8 h-8"
          onClick={() => setSideBarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
