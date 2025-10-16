 import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import UserProfileInfo from "../components/UserProfileInfo";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-2xl">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="relative">
            <div className="h-52 bg-gray-200 rounded-t-2xl overflow-hidden">
              {user.cover_photo && (
                <img
                  src={user.cover_photo}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile Picture (slightly overlapping bottom) */}
            <div className="absolute left-8 bottom-0 translate-y-1/3">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-gray-100">
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between px-8 pb-6 pt-4">
            <UserProfileInfo user={user} setShowEdit={setShowEdit} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
