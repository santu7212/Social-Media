import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getChatMessages, sendMessage, serverSideEventController } from "../controllers/message.controller.js";



const messageRouter = Router();

messageRouter.get("/:userId",serverSideEventController)
messageRouter.post("/send-message",upload.single("image"), protect,sendMessage)
messageRouter.post("/get-message",protect,getChatMessages)


export default messageRouter