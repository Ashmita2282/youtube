// routes/videoRoutes.js
import express from "express";
import {
  getVideoById,
  addVideo,
  likeVideo,
  addComment,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get a single video by ID
router.get("/video/:id", getVideoById);

router.get("/video", getVideoById);

// Add a new video (protected route, requires JWT)
router.post("/video/add-video", authMiddleware, addVideo);

// Like or dislike a video
router.post("/video/:id/like-dislike", authMiddleware, likeVideo);

// Add a comment to a video
router.post("/video/:id/comments", authMiddleware, addComment);

export default router;
