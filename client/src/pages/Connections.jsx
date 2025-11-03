 import React, { useEffect, useState } from "react";
import {
  User,
  UserPlus,
  UserRoundPen,
  MessagesSquare,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connections = () => {
  const [currentTab, setcurrentTab] = useState("Followers");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const {
    connections = [],
    pendingConnections = [],
    followers = [],
    following = [],
  } = useSelector((state) => state.connections || {});

  const dataArray = [
    { label: "Followers", value: followers, icon: User },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/unfollow-user",
        { targetId: userId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message || "Unfollowed successfully");
        dispatch(fetchConnections(await getToken()));
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/connection/accept-connection",
        { targetId: userId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message || "Connection accepted");
        dispatch(fetchConnections(await getToken()));
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-red-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Connections
          </h1>
          <p className="text-slate-600 text-sm">
            Manage and grow your{" "}
            <span className="text-blue-500 font-semibold">Pl</span>
            <span className="text-red-500 font-semibold">ixa</span> network
          </p>
        </div>

        {/* Responsive Tabs (2×2 on mobile, 4×1 on desktop) */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-slate-200 rounded-xl p-2 bg-white/70 shadow backdrop-blur-md">
            {dataArray.map((tab) => (
              <button
                onClick={() => setcurrentTab(tab.label)}
                key={tab.label}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all select-none cursor-pointer
                  ${
                    currentTab === tab.label
                      ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold
                    ${
                      currentTab === tab.label
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {tab.value?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification-Style List */}
        <div className="flex flex-col gap-4 mt-8 max-w-2xl mx-auto px-2">
          {dataArray
            .find((item) => item.label === currentTab)
            ?.value?.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white/80 backdrop-blur-md border border-slate-200 shadow rounded-xl p-4 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile_picture}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover shadow-md cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  />
                  <div>
                    <p
                      className="font-semibold text-slate-800 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      {user.full_name}
                    </p>
                    <p className="text-slate-500 text-sm">@{user.username}</p>
                  </div>
                </div>

                {currentTab === "Following" && (
                  <button
                    onClick={() => handleUnfollow(user._id)}
                    className="text-sm px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm transition-all"
                  >
                    Unfollow
                  </button>
                )}

                {currentTab === "Pending" && (
                  <button
                    onClick={() => acceptConnection(user._id)}
                    className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 hover:to-emerald-600 text-white shadow transition-all"
                  >
                    Accept
                  </button>
                )}

                {currentTab === "Connections" && (
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className="text-sm px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1 shadow-sm transition-all"
                  >
                    <MessagesSquare className="w-4 h-4" /> Message
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
