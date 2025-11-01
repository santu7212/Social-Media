// Add user story

import { inngest } from "../inngest/index.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import { imagekit } from "../configs/imagekit.js"; 
import fs from "fs"
 
const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    console.log("media_type:", media_type);

    const media = req.file; 
    let media_url = "";

    // Upload to ImageKit only if there's an actual file
    if ((media_type === "image" || media_type === "video") && media) {
      const fileBuffer = fs.readFileSync(media.path); // ✅ fixed here

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname, // ✅ fixed variable name
      });

      media_url = response.url;

      // cleanup the local file after upload (optional but recommended)
      fs.unlinkSync(media.path);
    }

    // Create Story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      background_color,
      media_type,
    });

    // Schedule story deletion after 24 hours
    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Story upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at add user story",
    });
  }
};
// get user story 
const getUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user =await User.findById(userId)
    // user connection and following 
    const UserIds=[userId,...user.connections,...user.following]

    const stories=await Story.find({
        user:{$in : UserIds},

    }).populate("user").sort({createdAt:-1})
    res.status(200).json({success:true,stories})
    
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error at get  user story",
      });
  }
};



export  {addUserStory,getUserStory}
