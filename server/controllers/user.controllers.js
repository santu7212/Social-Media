import User from "../models/user.model";

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


export {getUserData}