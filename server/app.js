import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import {inngest,functions} from "./inngest/index.js"
// import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(express.json());
app.use(cors());

// app.use(clerkMiddleware)

app.get("/", (req, res) => res.send("server is running for plixa"));
app.use("/api/inngest", serve({ client: inngest, functions }))

export default app;
