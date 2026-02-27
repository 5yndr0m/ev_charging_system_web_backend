// src/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe, getAllUsers, updateProfile, getAuthStats } from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, admin, getAllUsers);
router.put("/profile", protect, updateProfile);
router.get("/stats", protect, admin, getAuthStats);

export default router;
