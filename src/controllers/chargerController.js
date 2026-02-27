// src/controllers/chargerController.js
import Charger from "../models/Charger.js";

// GET /api/chargers
export const getChargers = async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chargers/:id
export const getChargerById = async (req, res) => {
  try {
    const charger = await Charger.findById(req.params.id);
    if (!charger) return res.status(404).json({ message: "Charger not found" });
    res.json(charger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chargers/available
export const getAvailableChargers = async (req, res) => {
  try {
    const chargers = await Charger.find({ status: "Available" });
    res.json(chargers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/chargers/:id/status
export const updateChargerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const charger = await Charger.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!charger) return res.status(404).json({ message: "Charger not found" });
    res.json(charger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
