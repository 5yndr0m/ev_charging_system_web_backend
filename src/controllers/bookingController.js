// src/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Charger from "../models/Charger.js";
import Vehicle from "../models/Vehicle.js";
import { createNotification } from "./notificationController.js";
import { logger } from "../utils/logger.js";

// POST /api/bookings  (create booking) - protected
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, chargerId, startTime, endTime } = req.body;
    const userId = req.user._id;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // validate vehicle belongs to user (if vehicleId provided)
    if (vehicleId) {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) return res.status(400).json({ message: "Vehicle not found" });
      if (!vehicle.userId.equals(userId)) return res.status(403).json({ message: "Vehicle does not belong to user" });
    }

    // validate charger exists
    const charger = await Charger.findById(chargerId);
    if (!charger) return res.status(404).json({ message: "Charger not found" });

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      chargerId,
      status: { $in: ["Booked", "Confirming"] }, // Check active bookings
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Overlap condition
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Charger is already booked for this time slot" });
    }

    // Calculate total cost
    const durationHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    const totalCost = durationHours * (charger.pricePerHour || 50); // Default to 50 if price missing

    // create booking
    const booking = await Booking.create({
      userId,
      vehicleId,
      chargerId,
      startTime,
      endTime,
      status: "Booked",
      totalCost
    });

    logger.info(`Booking created: ${booking._id} by user ${userId}`);

    // Create notification: Booking Confirmed
    await createNotification(
      userId,
      "Booking Confirmed",
      `Your booking for ${charger.name || 'Charger'} is confirmed from ${new Date(startTime).toLocaleTimeString()} to ${new Date(endTime).toLocaleTimeString()}.`,
      "success",
      "bookingConfirmed"
    );

    // Create notification: Payment Successful (Simulated)
    await createNotification(
      userId,
      "Payment Successful",
      `Payment of $${totalCost.toFixed(2)} was successful.`,
      "success",
      "payment"
    );

    res.status(201).json(booking);
  } catch (err) {
    logger.error("Error creating booking", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings (admin) - list all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("vehicleId")
      .populate({
        path: "chargerId",
        populate: { path: "stationId", select: "name location" }
      });
    res.json(bookings);
  } catch (err) {
    logger.error("Error getting all bookings", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/my (user's bookings)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("vehicleId")
      .populate("chargerId");
    res.json(bookings);
  } catch (err) {
    logger.error(`Error getting bookings for user ${req.user._id}`, err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/stats (admin) - counts and vehicle type aggregation
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const bookedCount = await Booking.countDocuments({ status: "Booked" });
    const completedCount = await Booking.countDocuments({ status: "Completed" });

    // vehicle type aggregation via joining vehicle collection
    const vehicleStats = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle"
        }
      },
      { $unwind: "$vehicle" },
      {
        $group: {
          _id: "$vehicle.type",
          count: { $sum: 1 }
        }
      }
    ]);

    // charger status counts
    const chargerCounts = await Charger.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ totalBookings, bookedCount, completedCount, vehicleStats, chargerCounts });
  } catch (err) {
    logger.error("Error getting booking stats", err);
    res.status(500).json({ message: "Server error" });
  }
};
