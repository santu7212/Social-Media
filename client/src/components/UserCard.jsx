 import React from "react";
import { dummyUserData } from "../assets/assets";
import { MapPin, MessageCircle, Plus, UserPlus2Icon } from "lucide-react";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;

  const handleFollow = async () => {};
  const handleConnectionRequest = async () => {};

  const isFollowing = currentUser?.following.includes(user._id);
  const isConnected = currentUser?.connections.includes(user._id);

  return (
    <div
      key={user._id}
      className="relative w-72 p-6 rounded-3xl overflow-hidden border border-slate-200/60 
        bg-gradient-to-br from-white via-slate-50 to-slate-100
        shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all duration-300"
    >
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm"
        />
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 leading-tight">
            {user.full_name}
          </h3>
          {user.username && (
            <p className="text-sm text-slate-500">@{user.username}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-slate-600 mt-3 truncate leading-snug italic">
          {user.bio}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>{user.location || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-red-500">{user.followers.length}</span>
          Followers
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center mt-5 gap-3">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300
            ${
              isFollowing
                ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-red-500 text-white active:scale-[0.97]"
            }`}
        >
          <UserPlus2Icon className="h-5 w-5" />
          {isFollowing ? "Following" : "Follow"}
        </button>

        {/* Connect / Message Button */}
        <button
          onClick={handleConnectionRequest}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200
            bg-white shadow-sm cursor-pointer active:scale-95 transition-all duration-200"
        >
          {isConnected ? (
            <MessageCircle className="h-5 w-5 text-blue-500" />
          ) : (
            <Plus className="w-5 h-5 text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
