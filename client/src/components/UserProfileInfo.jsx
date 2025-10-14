 import { VerifiedIcon } from "lucide-react";
import React from "react";

const UserProfileInfo = ({ user }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{user.full_name}</h1>
        <VerifiedIcon className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-sm text-gray-600">@{user.username || "Add a username"}</p>

       
    </div>
  );
};

export default UserProfileInfo;
