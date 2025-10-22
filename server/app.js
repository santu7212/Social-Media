import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import {inngest,functions} from "./inngest/index.js"

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running of plixa"));
app.use("/api/ingest", serve({ client: inngest, functions }))

export default app;
