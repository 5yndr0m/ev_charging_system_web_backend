// src/routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingStats
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking); // create booking by logged-in user
router.get("/my", protect, getMyBookings); // user's bookings
router.get("/", protect, admin, getAllBookings); // admin list
router.get("/stats", protect, admin, getBookingStats); // admin stats

export default router;
