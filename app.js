import express from "express";
import { connect } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import video from "./routes/videoRoutes.js";
const app = express();

import dotenv from "dotenv";

dotenv.config();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", video);

connect();
export { app };
