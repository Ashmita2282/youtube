// routes/channelRoutes.js
import express from "express";
import { createChannel, getChannelById } from "../controllers/channelController.js";


const router = express.Router();

router.post("/create-channel", createChannel);
router.get("/channel", getChannelById);

export default router;
