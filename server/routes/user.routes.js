import { Router } from "express";
import {
  discoverUser,
  followUser,
  getUserData,
  unfollowUser,
  updateUserData,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.get("/get-user", protect, getUserData);
userRouter.post(
  "/update-user",
  protect,
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    {
      name: "cover_photo",
      maxCount: 1,
    },
  ]),

  updateUserData
);
userRouter.post("/discover-user", protect, discoverUser);
userRouter.post("/follow-user", protect, followUser);
userRouter.post("/unfollow-user", protect, unfollowUser);

export default userRouter;
