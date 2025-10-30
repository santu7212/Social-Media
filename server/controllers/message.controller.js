import { format } from "path";
import { imagekit } from "../configs/imagekit.js";
import Message from "../models/message.model.js";
import fs from "fs";

// create an empty object to store server side Event connections
const connections = {};

// controller function for  server side endpoint
const serverSideEventController = (req, res) => {
  const { userId } = req.params;
  console.log("New client connected", userId);

  // set sse headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Catch-Control", "no-catch");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // add the client's response object to the  connection object
  connections[userId] = res;

  // send an initial event to the client
  res.write("log: Connected to SSE stream\n\n");

  // Handle client disconnectioin
  req.on("close", () => {
    // remove the clients respone object from the connection array
    delete connections[userId];
    console.log("Client disconnected");
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
    const messages = (
      await Message.find(
        { to_user_id: userId }.populate("from_user_id to_user_id")
      )
    ).toSorted({ createdAt: -1 });
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
