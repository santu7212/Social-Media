 import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import UserProfileInfo from '../components/UserProfileInfo';

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState("false");

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
          
          {/* Cover Photo */}
          <div className="relative h-40 md:h-56 bg-gradient-to-r from-blue-600 via-purple-500 to-red-500">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Profile Picture overlapping cover */}
            <div className="absolute left-6 md:left-8 bottom-0 transform translate-y-1/2">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gray-100">
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info below profile picture */}
          <div className="px-6 md:px-8 mt-20">
            <UserProfileInfo user={user} />
          </div>

          {/* Posts or other content */}
          <div className="p-6 pt-6">
            {/* Here you can render posts or tabs */}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
