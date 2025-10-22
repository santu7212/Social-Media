 import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModel from "../components/ProfileModel";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* profile card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* cover Photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-blue-200 via-pink-200 to-red-200 relative">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* user Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
            editButtonClass="px-4 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-red-600 transition cursor-pointer"
            locationClass="text-indigo-500 font-medium" // Calendar-like color
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-md p-1 flex max-w-md mx-auto border border-gray-100">
            {["posts", "media", "likes"].map((tab) => (
              <button
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* posts */}
          {activeTab === "posts" && (
            <div className="mt-6 space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* media */}
          {activeTab === "media" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <Link
                        target="_blank"
                        to={image}
                        key={index}
                        className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer"
                      >
                        <img
                          src={image}
                          className="w-full aspect-video object-cover rounded-lg"
                          alt=""
                        />

                        <p
                          className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl
                          text-white opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30 rounded-l"
                        >
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
