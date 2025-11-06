import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/user.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import postRouter from "./routes/post.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();

 
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://social-media-nine-pink.vercel.app",
//   ],
//   credentials: true,
// }));

app.use(express.json());
app.use(cors({ credentials: true }));

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("server is running for plixa"));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/user", userRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message",messageRouter)
export default app;
