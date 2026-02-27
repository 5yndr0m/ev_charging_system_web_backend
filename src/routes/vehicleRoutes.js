// src/routes/vehicleRoutes.js
import express from "express";
import {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  getMyVehicles
} from "../controllers/vehicleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyVehicles); // user's vehicles
router.get("/", protect, admin, getAllVehicles); // admin list
router.post("/", protect, createVehicle); // users can add vehicles
router.get("/:id", protect, getVehicleById);
router.put("/:id", protect, updateVehicle);

export default router;
