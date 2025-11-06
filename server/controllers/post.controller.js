import fs from "fs";
import { imagekit } from "../configs/imagekit.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files || [];

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }
 
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let image_urls = [];
    if (images.length > 0) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });
          return imagekit.url({
            path: response.filePath,
            transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
          });
        })
      );
    }

    const newPost = await Post.create({
      user: userId,    
      content,
      image_urls,
      post_type,
    });

    // Return the created post
    return res.status(201).json({ success: true, message: "Post created", post: newPost });
  } catch (error) {
    console.error("Error at addPost:", error);
    return res.status(500).json({ success: false, message: "Internal server error at addPost" });
  }
};



const getFeedPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userIds = [userId, ...(user.connections || []), ...(user.following || [])];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate({
        path: "user",
        model: "User",
        select: "full_name username profile_picture", 
      })
      .sort({ createdAt: -1 })
      .lean();

    const validPosts = posts.filter(p => p.user);

    return res.status(200).json({ success: true, posts: validPosts });
  } catch (error) {
    console.error("Error in getFeedPost:", error);
    return res.status(500).json({ success: false, message: "Internal server error at get feed post" });
  }
};


// Like post
const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.likes_count.includes(userId)) {
      post.likes_count = post.likes_count.filter((user) => user !== userId);
      await post.save();
      res.status(200).json({ success: true, message: "post unliked" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      res.status(200).json({ success: true, message: "post liked" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error at  like post",
    });
  }
};

export { addPost, getFeedPost, likePost };
