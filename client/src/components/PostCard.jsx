import React, { useState } from "react";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast"

const PostCard = ({ post }) => {
  const postWithSpecialCharacters = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600 font-medium">$1</span>'
  );

  const [likes, setLikes] = useState(post.likes_count);
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        "/api/post/like",
        { postId: post._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if(data.success){
        toast.success(data.message)
        setLikes(prev=>{
          if(prev.includes(currentUser._id)){
              return prev.filter(id=>id !== currentUser._id)
          }else{
            return [...prev,currentUser._id]
          }
        })
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)

    }
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4 w-full max-w-2xl">
      {/* --- User Info --- */}
      <div className="flex items-center gap-3">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-11 h-11 rounded-full border border-gray-200 object-cover cursor-pointer"
          onClick={() => navigate(`/profile` + post.user._id)}
        />
        <div>
          <div
            className="flex items-center space-x-1 text-gray-900 font-semibold cursor-pointer"
            onClick={() => navigate(`/profile` + post.user._id)}
          >
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm cursor-default">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* --- Post Content --- */}
      {post.content && (
        <div
          className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-line cursor-default"
          dangerouslySetInnerHTML={{ __html: postWithSpecialCharacters }}
        />
      )}

      {/* --- Post Images --- */}
      {post.image_urls?.length > 0 && (
        <div
          className={`grid gap-2 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`w-full rounded-xl object-cover ${
                post.image_urls.length === 1 ? "h-auto" : "h-56"
              }`}
            />
          ))}
        </div>
      )}

      {/* --- Actions --- */}
      <div className="flex items-center gap-6 text-gray-600 text-sm pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-5 h-5 cursor-pointer ${
              likes.includes(currentUser._id) ? "text-red-500" : "text-gray-500"
            }`}
            onClick={handleLike}
          />
          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5 text-gray-500" />
          <span>12</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className="w-5 h-5 text-gray-500" />
          <span>12</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
