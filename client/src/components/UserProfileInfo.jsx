import { Calendar, MapPin, PenBox, VerifiedIcon } from "lucide-react";
import moment from "moment"
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name}
                </h1>
                <VerifiedIcon className="text-blue-600 w-5 h-5" />
              </div>
              <p className="text-gray-600 mt-0.5">
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>

            {/* Edit profile for that particular user  */}
            {!profileId && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 border border-grey-300 hover:bg-grey-50
               px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <p className="text-grey-700 text-sm max-w-md mt-4">{user.bio}</p>
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-grey-500
          mt-4"
          >
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 
            text-grey-500 mt-4">
              <MapPin className="w-4 h-4" />
              {user.location ? user.location : "Add location"}
            </span>
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm 
            text-grey-500 mt-4">
              <Calendar className="w-4 h-4" />
              joined  <span className="font-medium">{moment(user.createdAt).fromNow()}</span>
            </span>
          </div>
          <div className="flex items-center gap-6 mt-6 border-t border-grey-200 pt-4">

            <div>
              <span className="sm:text-xl font-bold text-grey-900 ">{posts.length}</span>
              <span className="text-xs sm:text-sm text-grey-grey-500 ml-1.5 "> Post </span>
            </div>

            <div>
              <span className="sm:text-xl font-bold text-grey-900 ">{user.followers.length}</span>
              <span className="text-xs sm:text-sm text-grey-grey-500 ml-1.5 ">Followers  </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-grey-900 ">{user.following.length}</span>
              <span className="text-xs sm:text-sm text-grey-grey-500 ml-1.5 ">Following  </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
