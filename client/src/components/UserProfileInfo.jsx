 import { VerifiedIcon } from "lucide-react";
import React from "react";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className="relative py-4 px-6 md:px-8 bg-white">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute -top-14">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* User Info */}
        <div className="w-full pt-14 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <VerifiedIcon className="text-blue-600 w-5 h-5" />
              </div>
              <p className="text-gray-600 mt-0.5">
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
