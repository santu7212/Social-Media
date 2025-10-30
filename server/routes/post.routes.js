import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addPost,
  getFeedPost,
  likePost,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/add-post", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPost);
postRouter.post("/like", protect, likePost);

export default postRouter;
