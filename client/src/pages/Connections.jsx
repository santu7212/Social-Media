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

  const { connections = [], pendingConnections = [], followers = [], following = [] } =
    useSelector((state) => state.connections || {});

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
        {
          targetId: userId,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.messsage);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.messsage);
      }
    } catch (error) {
      toast.error(error.messsage);
    }
  };

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/connection/accept-connection",
        {
          targetId: userId,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.messsage);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.messsage);
      }
    } catch (error) {
      toast.error(error.messsage);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-red-50">
      <div className="max-w-6xl mx-auto p-6">
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

        {/* Counts */}
        <div className="mb-10 flex flex-wrap justify-center gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1
              backdrop-blur-xl bg-white/70 border border-slate-200 shadow-md
              h-28 w-44 rounded-2xl cursor-pointer select-none"
            >
              <b className="text-2xl bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                {item.value?.length || 0}
              </b>
              <p className="text-slate-700 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-2 border border-slate-200 rounded-xl p-1 bg-white/70 shadow backdrop-blur-md">
            {dataArray.map((tab) => (
              <button
                onClick={() => setcurrentTab(tab.label)}
                key={tab.label}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all select-none cursor-pointer
                  ${
                    currentTab === tab.label
                      ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold
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

        {/* Connections List */}
        <div className="flex flex-wrap gap-6 mt-8 justify-center">
          {dataArray
            .find((item) => item.label === currentTab)
            ?.value?.map((user) => (
              <div
                key={user._id}
                className="w-full sm:w-[22rem] flex gap-5 p-5 bg-white/80 backdrop-blur-md
                border border-slate-200 shadow-lg rounded-2xl transition-all"
              >
                <img
                  src={user.profile_picture}
                  className="rounded-full w-14 h-14 object-cover shadow-md cursor-pointer transition-transform hover:scale-105"
                  alt=""
                  onClick={() => navigate(`/profile/${user._id}`)}
                />
                <div className="flex-1">
                  <p
                    className="font-semibold text-slate-800 cursor-pointer transition-colors hover:text-blue-600"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    {user.full_name}
                  </p>
                  <p className="text-slate-500 text-sm">@{user.username}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {user.bio?.slice(0, 30)}...
                  </p>

                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="w-full p-2 text-sm rounded-lg bg-gradient-to-r
                      from-blue-500 to-red-500 hover:to-red-600
                      text-white active:scale-95 transition-all shadow cursor-pointer"
                    >
                      View Profile
                    </button>

                    {currentTab === "Following" && (
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="w-full p-2 text-sm rounded-lg bg-slate-100
                        hover:bg-slate-200 text-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}

                    {currentTab === "Pending" && (
                      <button
                        onClick={() => acceptConnection(user._id)}
                        className="w-full p-2 text-sm rounded-lg bg-gradient-to-r
                        from-green-400 to-emerald-500 hover:to-emerald-600
                        text-white active:scale-95 transition-all shadow cursor-pointer"
                      >
                        Accept
                      </button>
                    )}

                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded-lg bg-slate-100
                        hover:bg-slate-200 text-slate-800 active:scale-95 
                        transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessagesSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
