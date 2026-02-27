// src/controllers/vehicleController.js
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// GET /api/vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("userId", "name email");
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vehicles/my
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const { type, make, model, plateNumber } = req.body;
    const userId = req.user._id; // Use authenticated user ID

    if (!type) return res.status(400).json({ message: "Type is required" });

    const vehicle = await Vehicle.create({ userId, type, make, model, plateNumber });

    // push to user's vehicles array
    await User.findByIdAndUpdate(userId, { $push: { vehicles: vehicle._id } });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("userId", "name email");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
