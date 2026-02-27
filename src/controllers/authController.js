// src/controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, vehicle } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    if (!vehicle)
      return res.status(400).json({ message: "Vehicle is required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
      vehicle, // ✅ added vehicle
    });

    res.status(201).json({
      message: "User created",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle,
      },
      token: generateToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, vehicle: user.vehicle },
      token: generateToken(user)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, vehicle: req.user.vehicle });
};

// GET /api/auth/users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).populate("vehicles");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    // Update simple vehicle string if provided
    if (req.body.vehicle) {
      user.vehicle = req.body.vehicle;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      vehicle: updatedUser.vehicle,
      token: generateToken(updatedUser), // Sending new token just in case
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/stats
export const getAuthStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Simulate distribution for demo purposes since we don't track specific auth methods per user yet
    const stats = [
      { method: "RFID Cards", users: Math.floor(totalUsers * 0.8), success: "99.2%", icon: "Shield" },
      { method: "Mobile App", users: Math.floor(totalUsers * 0.95), success: "97.8%", icon: "Smartphone" },
      { method: "License Plate", users: Math.floor(totalUsers * 0.3), success: "94.5%", icon: "Camera" },
    ];

    const recentEvents = [
      { user: "John Silva", method: "RFID", station: "Colombo", time: "2 min ago", status: "Success" },
      { user: "Maria Fernando", method: "Mobile App", station: "Kandy", time: "5 min ago", status: "Success" },
      { user: "Unknown Vehicle", method: "License Plate", station: "Galle", time: "8 min ago", status: "Failed" },
      { user: "Fleet Vehicle #23", method: "RFID", station: "Negombo", time: "12 min ago", status: "Success" },
    ];

    res.json({ stats, recentEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
