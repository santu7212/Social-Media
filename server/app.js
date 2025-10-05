import express from "express";
import cors from "cors";
import {inngest,functions} from "./inngest/index.js"

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running bro"));
app.use("/api/ingest", serve({ client: inngest, functions }))

export default app;
