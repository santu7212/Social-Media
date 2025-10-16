 import { VerifiedIcon } from "lucide-react";
import React from "react";

const UserProfileInfo = ({ user }) => {
  return (
    <div className="flex items-center gap-4 ml-32">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 leading-none">
            {user.full_name}
          </h1>
          <VerifiedIcon className="text-blue-600 w-4 h-4" />
        </div>
        <p className="text-slate-500 text-sm mt-0.5">@{user.username}</p>
      </div>
    </div>
  );
};

export default UserProfileInfo;
