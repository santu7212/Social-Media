import { format } from "path";
import { imagekit } from "../configs/imagekit.js";
import Message from "../models/message.model.js";
import fs from "fs";

// create an empty object to store server side Event connections
const connections = {};

// controller function for  server side endpoint
 const serverSideEventController = (req, res) => {
  const { userId } = req.params;
  console.log("New client connected:", userId);

  // 1️⃣ Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 2️⃣ Force Express to send headers immediately
  res.flushHeaders?.();

  // 3️⃣ Store the client connection
  connections[userId] = res;

  // 4️⃣ Send initial event (MUST start with `data:`)
  res.write(`data: ${JSON.stringify({ message: "Connected to SSE stream" })}\n\n`);

  // 5️⃣ Heartbeat to prevent timeout every 15s
  const interval = setInterval(() => {
    res.write(":\n\n"); // comment event — keeps connection alive
  }, 15000);

  // 6️⃣ Clean up when client disconnects
  req.on("close", () => {
    clearInterval(interval);
    delete connections[userId];
    console.log("Client disconnected:", userId);
  });
};

// send Message
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;
    let media_url = "";
    let message_type = image ? "image" : "text";
    if (message_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }
    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    res.status(200).json({ success: true, message });
    //  send message to_user_id using SSE
    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id"
    );
    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at send message",
    });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ createdAt: -1 });

    // Mark messages as seen
    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId },
      { seen: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at Get message",
    });
  }
};
const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
     const messages = await Message.find({ to_user_id: userId })
  .populate("from_user_id to_user_id")
  .sort({ createdAt: -1 });

    res.status(200).json({success:true,messages})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at Get Recent Message",
    });
  }
};

export {
  serverSideEventController,
  sendMessage,
  getChatMessages,
  getUserRecentMessages,
};
