import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addUserStory, getUserStory } from "../controllers/story.controller.js";

const  storyRouter = Router();

storyRouter.post("/create-story",upload.single("media"),protect,addUserStory)
storyRouter.get("/get-story",protect,getUserStory)

export default storyRouter