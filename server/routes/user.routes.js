import { Router } from "express";
import {
    discoverUser,
    followUser,
    getUserData,
    unfollowUser,
    updateUserData,
} from "../controllers/user.controllers.js";
import protect from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.get("/get-user", protect, getUserData);
userRouter.post(
    "/update-user",
    upload.fields([
        { name: "profile_picture", maxCount: 1 },
        {
            name: "cover_photo",
            maxCount: 1,
        },
    ]),
    protect,
    updateUserData
);
userRouter.post("/discover-user", protect, discoverUser);
userRouter.route("/follow-user", protect, followUser);
userRouter.route("/unfollow-user", protect, unfollowUser);

export default userRouter
