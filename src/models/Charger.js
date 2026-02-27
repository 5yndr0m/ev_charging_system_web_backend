// src/models/Charger.js
import mongoose from "mongoose";

const chargerSchema = new mongoose.Schema(
  {
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
    name: String,
    type: String, // FC-SP, FC-DP, L2-HC etc
    power: Number,
    connectorType: { type: String, default: "CCS2" },
    pricePerHour: { type: Number, default: 0 },
    status: { type: String, enum: ["Available", "Booked", "In Use", "OutOfOrder"], default: "Available" }
  },
  { timestamps: true }
);

const Charger = mongoose.model("Charger", chargerSchema);
export default Charger;
