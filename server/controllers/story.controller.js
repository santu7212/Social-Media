// Add user story

import { inngest } from "../inngest/index.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    // Upload media to imagekit
    if (media_type === "image" || media_type === "video") {
      const fileBuffer = fs.readFileSync(file.path);

      const response = await imagekit.upload({
        file: fileBuffer, // file buffer
        fileName: media_url.originalname, // original file name
      });

      media_url = response.url;
    }

    // Create Story 
    const story =await Story.create({
        user: userId,
        content,
        media_url,
        background_color
    })
    // schedule story deleteion after 24 hours 
    await inngest.send({
      name: "app/story.delete",
      data: {storyId: story._id},
      

    })

    res.status(200).json({success:true})
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
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
