import express from "express";
import { getFleets, createFleet, updateFleet, deleteFleet } from "../controllers/fleetController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getFleets);
router.post("/", protect, admin, createFleet);
router.put("/:id", protect, admin, updateFleet);
router.delete("/:id", protect, admin, deleteFleet);

export default router;
