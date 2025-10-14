import React from "react";
import { dummyUserData } from "../assets/assets";
import { MapPin, UserPlus, UserPlus2, UserPlus2Icon } from "lucide-react";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;

  const handleFollow = async () => {};

  const handleConnectionRequest = async () => {};
  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 shadow border boreder-grey-200
    rounded-md"
    >
      <div className="text-center">
        <img
          src={user.profile_picture}
          className="rounded-full w-16 shadow-md
            max-auto"
          alt=""
        />
        <p className="mt-4 font-semibold">{user.full_name}</p>
        {user.username && (
          <p className="text-grey-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p
            className="text-grey-600 mt-2 text-center text-sm 
            px-4"
          >
            @{user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-grey-600">
        <div
          className="flex items-center gap-1 border border-grey-300 rounded-full
            px-3 py-1"
        >
          <MapPin className="w-4 h-4" />
          {user.locaton}
        </div>
        <div
          className="flex items-center gap-1 border border-grey-300 rounded-full
            px-3 py-1"
        >
          <span>{user.followers.length}</span>Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        {/* Follow button  */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className=""
        >
          <UserPlus2Icon className="h-4 w-4" />
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
