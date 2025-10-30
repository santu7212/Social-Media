import { inngest } from "../inngest/index.js";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

//  send connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { targetId } = req.body;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: "Target user ID is required.",
      });
    }

    // Prevent self-request
    if (userId === targetId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a connection request to yourself.",
      });
    }

    // Check if the user sent more than 20 requests in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequest = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours },
    });

    if (connectionRequest.length >= 20) {
      return res.status(429).json({
        success: false,
        message: "You cannot send more than 20 requests in 24 hours.",
      });
    }

    // Check if the user is already connected or pending
    const isConnected = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: targetId },
        { from_user_id: targetId, to_user_id: userId },
      ],
    });

    if (!isConnected) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: targetId,
      });
      await inngest.send({
        name: "app/connection-request",
        data: {
          connectionId: newConnection._id,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Connection request sent successfully!",
      });
    }

    if (isConnected.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "You are already connected with this user.",
      });
    }

    if (isConnected.status === "pending") {
      return res.status(200).json({
        success: true,
        message: "A connection request is already pending.",
      });
    }

    // Fallback (should rarely happen)
    return res.status(400).json({
      success: false,
      message: "Unable to process connection request.",
    });
  } catch (error) {
    console.error("Error sending connection request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending connection request.",
    });
  }
};

// Get Connection

const getUserConnection = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findById(userId).populate(
    "connections followers, following"
  );
  const connections = user.connections;
  const followers = user.followers;
  const following = user.following;

  const pendingConnection = (
    await Connection.find({ to_user_id: userId, status: "pending" }).populate(
      "from_user_id"
    )
  ).map((connection) => connection.from_user_id);

  res.status(200).json({
    success: true,
    connections,
    followers,
    following,
    pendingConnection,
  });
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { targetId } = req.body;
    const isConnected = await Connection.findOne({
      from_user_id: targetId,
      to_user_id: userId,
    });

    if (!isConnected) {
      return res
        .status(400)
        .json({ success: false, message: "connection not found" });
    }

    const user = await User.findById(userId);
    user.connections.push(targetId);
    await user.save();

    const toUser = await User.findById(targetId);
    toUser.connections.push(userId);
    await toUser.save();

    isConnected.status = "accepted";
    await isConnected.save();

    res
      .status(200)
      .json({ success: true, message: "Connection accepted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at accept request ",
    });
  }
};

export { sendConnectionRequest, getUserConnection, acceptConnectionRequest };
