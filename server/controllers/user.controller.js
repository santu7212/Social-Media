import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { uploadToImageKit } from "../utils/imagekitHelper.js";

// Get user data from userID

const getUserData = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    console.log("User Details:", user);

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
};
const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, full_name, location, bio } = req.body;

    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Keep existing username if not provided
    if (!username) username = tempUser.username;

    // Check username availability
    if (tempUser.username !== username) {
      const existing = await User.findOne({ username });
      if (existing) username = tempUser.username;
    }

    const updatedData = { username, bio, location, full_name };

    // Handle images
    const { profile_picture, cover_photo } = req.files || {};
    const profileFile = profile_picture?.[0];
    const coverFile = cover_photo?.[0];

    if (profileFile) {
      updatedData.profile_picture = await uploadToImageKit(profileFile, 512);
    }

    if (coverFile) {
      updatedData.cover_photo = await uploadToImageKit(coverFile, 1280);
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user)
      return res.status(400).json({ message: "Failed to update user data" });

    return res.status(200).json({
      success: true,
      user,
      message: "updated account details succesfully:",
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error for update userdata" });
  }
};

const discoverUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { search } = req.body;
    const allUser = await User.find({
      $or: [
        { username: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { full_name: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ],
    });

    const filterUser = allUser.filter((user) => user._id !== userId);
    res.status(200).json({ users: filterUser });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal server error for discover user" });
  }
};
 const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { targetId } = req.body;

    const user = await User.findById(userId);
    const isAlreadyFollowing = user.following.includes(targetId);

    if (isAlreadyFollowing) {
      return res.status(200).json({
        success: false,
        message: "You are already following that user.",
      });
    }

    user.following.push(targetId);
    await user.save();

    const toUser = await User.findById(targetId);
    toUser.followers.push(userId);
    await toUser.save();

    res.status(200).json({
      success: true,
      message: "Now you are following this user",
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: "Internal server error for followUser" });
  }
};

// Unfollow user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { targetId } = req.body; 

    // Prevent unfollowing yourself
    if (userId === targetId) {
      return res.json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    // Find both users
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.json({ success: false, message: "User not found" });
    }

   
    user.following = user.following.filter((id) => id !== targetId);
    await user.save();


    targetUser.followers = targetUser.followers.filter((id) => id !== userId);
    await targetUser.save();

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { profileId } = req.body;
    const profile = await User.findById(profileId);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found " });
    }
    const posts = await Post.find({ user: profileId }).populate("user");
    res.status(200).json({ success: true, profile, posts });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Internal server error at get user profile",
    });
  }
};

export {
  getUserData,
  updateUserData,
  discoverUser,
  followUser,
  unfollowUser,
  getUserProfile,
};
