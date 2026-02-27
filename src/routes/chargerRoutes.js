// src/routes/chargerRoutes.js
import express from "express";
import { getChargers, getChargerById, getAvailableChargers, updateChargerStatus } from "../controllers/chargerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getChargers);
router.get("/available", protect, getAvailableChargers);
router.get("/:id", protect, getChargerById);
router.put("/:id/status", protect, admin, updateChargerStatus);

export default router;
