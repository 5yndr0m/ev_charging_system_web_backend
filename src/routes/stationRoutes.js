// src/routes/stationRoutes.js
import express from "express";
import { getStations, getStationById, getSystemStats } from "../controllers/stationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getSystemStats);
router.get("/", getStations);
router.get("/:id", getStationById);

export default router;
