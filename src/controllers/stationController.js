import Station from "../models/Station.js";
import Charger from "../models/Charger.js";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

// GET /api/stations
export const getStations = async (req, res) => {
  try {
    const stations = await Station.find();

    // Fetch all chargers for these stations in one query
    const stationIds = stations.map(s => s._id);
    const allChargers = await Charger.find({ stationId: { $in: stationIds } });

    // Map chargers to their stations
    const chargersByStation = {};
    allChargers.forEach(charger => {
      if (!chargersByStation[charger.stationId]) {
        chargersByStation[charger.stationId] = [];
      }
      chargersByStation[charger.stationId].push(charger);
    });

    const result = stations.map(st => ({
      ...st.toObject(),
      chargers: chargersByStation[st._id] || []
    }));

    res.json(result);
  } catch (err) {
    logger.error("Error fetching stations", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stations/:id
export const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    const chargers = await Charger.find({ stationId: station._id });
    res.json({ ...station.toObject(), chargers });
  } catch (err) {
    logger.error(`Error fetching station ${req.params.id}`, err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET /api/stations/stats
export const getSystemStats = async (req, res) => {
  try {
    const activeStations = await Station.countDocuments({ status: "Active" });
    const totalChargers = await Charger.countDocuments();
    const activeCustomers = await User.countDocuments({ role: "user" });

    res.json({
      activeStations,
      totalChargers,
      activeCustomers,
      totalSolarPower: 2310,
      co2Savings: 1247,
      systemUptime: 99.7
    });
  } catch (err) {
    logger.error("Error fetching stats", err);
    res.status(500).json({ message: "Server error" });
  }
};
