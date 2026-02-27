// src/models/Station.js
import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    status: { type: String, enum: ["Active", "Offline", "Maintenance"], default: "Active" },
    image: String,
    latitude: { type: Number },
    longitude: { type: Number },
    totalChargers: { type: Number, default: 0 },
    availableChargers: { type: Number, default: 0 },
    // optional: you can keep chargers as separate collection (we do) and reference them when needed
  },
  { timestamps: true, strict: false }
);

const Station = mongoose.model("Station", stationSchema);
export default Station;
