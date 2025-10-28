import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  acceptConnectionRequest,
  getUserConnection,
  sendConnectionRequest,
} from "../controllers/connection.controller.js";

const connectionRouter = Router();
connectionRouter.post("/send-connection", protect, sendConnectionRequest);
connectionRouter.get("/get-connection-list", protect, getUserConnection);
connectionRouter.post("/accept-connection", protect, acceptConnectionRequest);


export default connectionRouter