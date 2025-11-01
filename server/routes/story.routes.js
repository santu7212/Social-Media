import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addUserStory, getUserStory } from "../controllers/story.controller.js";

const storyRouter = Router();

storyRouter.post(
  "/create-story",
  protect,
  upload.single("media"),
  addUserStory
);

storyRouter.get("/get-story", protect, getUserStory);

export default storyRouter;
