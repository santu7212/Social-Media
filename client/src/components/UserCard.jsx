import React from "react";
import { dummyUserData } from "../assets/assets";

const UserCard = ({user}) => {
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
            <img src={user.profile_picture} className="rounded-full w-16 shadow-md
            max-auto" alt="" />
            <p className="mt-4 font-semibold">{user.full_name}</p>
            {user.username && <p className="text-grey-500 font-light">
                @{user.username}</p>}
            {user.bio && <p className="text-grey-600 mt-2 text-center text-sm 
            px-4">
                @{user.bio}</p>}
        </div>


    </div>
  );
};

export default UserCard;
