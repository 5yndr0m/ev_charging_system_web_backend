// src/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // Optional for demo
    chargerId: { type: mongoose.Schema.Types.ObjectId, ref: "Charger", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    status: { type: String, enum: ["Booked", "InProgress", "Completed", "Cancelled"], default: "Booked" }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
