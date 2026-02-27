// src/models/Vehicle.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., EV, Hybrid, ICE
    make: String,
    model: String,
    plateNumber: String
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
