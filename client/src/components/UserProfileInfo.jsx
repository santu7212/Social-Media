 import { Calendar, MapPin, PenBox, VerifiedIcon } from "lucide-react";
import moment from "moment";
import React from "react";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className="relative py-6 px-6 md:px-8 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl absolute -top-16">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* User Info */}
        <div className="w-full pt-20 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {user.full_name}
                </h1>
                <VerifiedIcon className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-gray-500 mt-0.5">
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>

            {/* Edit profile button */}
            {!profileId && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-400 to-red-400 shadow-md hover:from-blue-500 hover:to-red-500 transition-all mt-4 md:mt-0 cursor-pointer"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-700 text-sm max-w-md mt-4">{user.bio}</p>

          {/* Location & Joined */}
          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-1 text-blue-500 font-medium">
              <MapPin className="w-4 h-4" />
              {user.location ? user.location : "Add location"}
            </span>
            <span className="flex items-center gap-1 text-blue-500">
              <Calendar className="w-4 h-4" />
              joined <span className="font-medium text-gray-700">{moment(user.createdAt).fromNow()}</span>
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-12 mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900">{posts.length}</span>
              <span className="text-xs sm:text-sm text-gray-500">Posts</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900">{user.followers.length}</span>
              <span className="text-xs sm:text-sm text-gray-500">Followers</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-900">{user.following.length}</span>
              <span className="text-xs sm:text-sm text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
