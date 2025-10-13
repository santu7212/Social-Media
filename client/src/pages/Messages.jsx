 import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-red-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Messages
          </h1>
          <p className="text-slate-600 text-sm">
            Talk to your friends and stay connected
          </p>
        </div>

        {/* Connected Users */}
        <div className="flex flex-col gap-4 items-center">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="w-full sm:w-[40rem] flex items-center gap-5 p-5 
              bg-white/80 backdrop-blur-md border border-slate-200 
              shadow-md rounded-2xl transition-all"
            >
              {/* Profile Picture */}
              <img
                src={user.profile_picture}
                className="rounded-full w-14 h-14 object-cover shadow-md cursor-pointer transition-transform hover:scale-105"
                alt={user.full_name}
                onClick={() => navigate(`/profile/${user._id}`)}
              />

              {/* User Info */}
              <div className="flex-1">
                <p
                  className="font-semibold text-slate-800 cursor-pointer transition-colors hover:text-blue-600"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  {user.full_name}
                </p>
                <p className="text-slate-500 text-sm">@{user.username}</p>
                <p className="text-xs text-slate-600 mt-1">{user.bio}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-10 flex items-center justify-center rounded-full
                  bg-gradient-to-r from-blue-500 to-red-500 
                  text-white active:scale-95 transition-all cursor-pointer 
                  shadow hover:shadow-lg hover:brightness-110"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-10 flex items-center justify-center rounded-full
                  bg-slate-100 text-slate-700 active:scale-95 transition-all 
                  cursor-pointer shadow-sm hover:bg-slate-200 hover:text-slate-900"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
