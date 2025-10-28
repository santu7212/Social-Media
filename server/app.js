import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/user.routes.js";
import connectionRouter from "./routes/connection.routes.js";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("server is running for plixa"));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/user", userRouter);
app.use("/api/connection", connectionRouter);

export default app;
