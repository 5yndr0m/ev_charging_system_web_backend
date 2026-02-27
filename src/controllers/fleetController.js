import Fleet from "../models/Fleet.js";
import { logger } from "../utils/logger.js";

// GET /api/fleets
export const getFleets = async (req, res) => {
    try {
        const fleets = await Fleet.find().sort({ createdAt: -1 });
        res.json(fleets);
    } catch (err) {
        logger.error("Error fetching fleets", err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/fleets
export const createFleet = async (req, res) => {
    try {
        const fleet = await Fleet.create(req.body);
        res.status(201).json(fleet);
    } catch (err) {
        logger.error("Error creating fleet", err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/fleets/:id
export const updateFleet = async (req, res) => {
    try {
        const fleet = await Fleet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fleet) return res.status(404).json({ message: "Fleet not found" });
        res.json(fleet);
    } catch (err) {
        logger.error("Error updating fleet", err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/fleets/:id
export const deleteFleet = async (req, res) => {
    try {
        const fleet = await Fleet.findByIdAndDelete(req.params.id);
        if (!fleet) return res.status(404).json({ message: "Fleet not found" });
        res.json({ message: "Fleet removed" });
    } catch (err) {
        logger.error("Error deleting fleet", err);
        res.status(500).json({ message: "Server error" });
    }
};
