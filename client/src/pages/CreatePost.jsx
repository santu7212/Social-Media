import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { X, Image } from "lucide-react";

import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../api/axios";

import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [Loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);

  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (!images.length && !content) {
      return toast.error("Please add at least one image or text ");
    }
    setLoading(true);
    const postType =
      images.length && content
        ? "text_with_image"
        : images.length
        ? "image"
        : "text";
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("post_type", postType);
      images.map((image) => {
        formData.append("images", image);
      });

      const { data } = await api.post("/api/post/add-post", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        navigate("/");
      } else {
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      throw new Error(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
            Create Post
          </h1>
          <p className="text-slate-500 text-sm">
            Share your thoughts with the world 🌍
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.profile_picture}
            alt=""
            className="w-14 h-14 rounded-full shadow-md border-2 border-blue-100"
          />
          <div>
            <h2 className="font-semibold text-lg text-slate-800">
              {user.full_name}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          name=""
          id=""
          rows="4"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 text-sm p-4 outline-none placeholder:text-gray-400"
          placeholder="What's happening?"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />

        {/* Images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-5">
            {images.map((image, i) => (
              <div
                key={i}
                className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <div
                  onClick={() =>
                    setImages(images.filter((_, index) => index !== i))
                  }
                  className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition-all duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-200 mt-6">
          <label
            htmlFor="images"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer font-medium"
          >
            <Image className="w-5 h-5" />
            Add Images
          </label>

          <input
            type="file"
            id="images"
            accept="image/*"
            hidden
            multiple
            onChange={(e) =>
              setImages([...images, ...Array.from(e.target.files)])
            }
          />

          <button
            disabled={Loading}
            onClick={() =>
              toast.promise(handleSubmit, {
                loading: "Uploading...",
                success: <p>Successfully uploaded 🎉</p>,
                error: <p>Failed to upload post 😢</p>,
              })
            }
            className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 active:scale-95 transition-transform text-white px-8 py-2.5 rounded-lg shadow-md hover:shadow-lg"
          >
            {Loading ? "Posting..." : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
