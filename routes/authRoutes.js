// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";

const { register, login, me } = authController;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);

export default router;
