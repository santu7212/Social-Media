import User from "../models/user.model";

import uploadToImageKit from "../utils/imagekitHelper";

// Get user data from userID

const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.json({ status: 200, user: user });
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
    if (!username) {
      username = tempUser.username;
    }

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        // We will not change the user name if its already taken
        username = tempUser.username;
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    const { profile_picture, cover_photo } = req.files;

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

    if (!user) {
      return res.status(400).json({ message: "Failed to update user data" });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error  for update userdata" });
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

// Follow user
const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { targetId } = req.body;

    const user = await User.findById(userId);
    const isAlreadyFollowing = user.following.includes(targetId);

    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already followinfg that user." });
    }

    // if not following
    user.following.push(targetId);
    await user.save();

    // Update follower list of that user whome u following

    const toUser = await User.findById(targetId);
    toUser.followers.push(userId);
    await toUser.save();

    res.status(200).json({ message: "Now you are following this user" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error for followUser" });
  }
};

export { getUserData, updateUserData, discoverUser,followUser };
