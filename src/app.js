import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import chargerRoutes from "./routes/chargerRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for website and admin dashboard
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",") 
    : ["*"];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf("*") !== -1 || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

import { logger } from "./utils/logger.js";

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Health check endpoint

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Mount routes

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/chargers", chargerRoutes);

app.use("/api/stations", stationRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/fleets", fleetRoutes);

app.use("/api/jobs", jobRoutes);


export default app;
