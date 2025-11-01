 import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Pencil } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ProfileModel = ({ setShowEdit }) => {
  const dispatch=useDispatch()
  const {getToken}=useAuth()
  const user =  useSelector((state)=>state.user.value)
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userData=new FormData();
      const {full_name,username,bio, location,profile_picture,cover_photo}=editForm
      userData.append("username",username)
      userData.append("bio",bio)
      userData.append("location",location)
      userData.append("full_name",full_name)
      

      profile_picture && userData.append("profile_picture",profile_picture);
      cover_photo && userData.append("cover_photo",cover_photo)
      const token= await  getToken()
      dispatch(updateUser({userData,token}))

      setShowEdit(false)
      
    } catch (error) {
      toast.error(error.message)
      
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-8 mx-4">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-8">
          Edit Profile
        </h1>

        <form onSubmit={e=>toast.promise(handleSaveProfile(e),{loading: "Saving..."})} className="space-y-4">
          {/* Profile & Cover Photos */}
          <div className="flex items-center justify-center gap-4">
            {/* Profile Photo */}
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById("profile_picture").click()}
            >
              <img
                src={
                  editForm.profile_picture
                    ? URL.createObjectURL(editForm.profile_picture)
                    : user.profile_picture
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 rounded-full">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <input
                hidden
                type="file"
                accept="image/*"
                id="profile_picture"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    profile_picture: e.target.files[0],
                  })
                }
              />
            </div>

            {/* Cover Photo */}
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById("cover_photo").click()}
            >
              <img
                src={
                  editForm.cover_photo
                    ? URL.createObjectURL(editForm.cover_photo)
                    : user.cover_photo
                }
                alt="Cover"
                className="w-56 h-24 rounded-xl object-cover shadow-md"
              />
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 rounded-xl">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <input
                hidden
                type="file"
                accept="image/*"
                id="cover_photo"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cover_photo: e.target.files[0],
                  })
                }
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-1">
              Full Name
            </label>
            <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-blue-400 to-red-400">
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-white focus:outline-none"
                placeholder="Enter your real name (e.g., John Doe)"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-1">
              Username
            </label>
            <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-blue-400 to-red-400">
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-white focus:outline-none"
                placeholder="Choose a unique username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-1">
              Bio
            </label>
            <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-blue-400 to-red-400">
              <textarea
                rows={4}
                className="w-full p-3 rounded-xl bg-white focus:outline-none resize-none"
                placeholder="Write something about yourself..."
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-1">
              Location
            </label>
            <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-blue-400 to-red-400">
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-white focus:outline-none"
                placeholder="Enter your city or country"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowEdit(false)}
              type="button"
              className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-red-500 shadow-md transition active:scale-95 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModel;
