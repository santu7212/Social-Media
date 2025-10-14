 import { VerifiedIcon } from "lucide-react";
import React from "react";

const UserProfileInfo = ({ user, post, profileId, setShowEdit }) => {
  return (
    <div className="relative py-6 px-6 md:px-8 bg-white">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg -mt-20 md:-mt-24 bg-gray-100 z-10">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {user.full_name}
            </h1>
            <VerifiedIcon className="text-blue-600 w-5 h-5" />
          </div>

          <p className="text-slate-500 text-sm mt-1">
            {user.username ? `@${user.username}` : "Add a username"}
          </p>

          {/* Accent underline */}
          <div className="mt-2 w-20 h-1 rounded-full bg-gradient-to-r from-blue-600 to-red-500"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
