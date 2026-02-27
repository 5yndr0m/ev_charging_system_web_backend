import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Station from "../models/Station.js";
import Charger from "../models/Charger.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import connectDB from "../config/db.js";
import { stationsData } from "./data.js";

dotenv.config();

// Pricing Logic from price_data.md
const getPrice = (type) => {
    switch (type) {
        case "FC-SP": return 95;
        case "FC-DP": return 90;
        case "L2-HC": return 45;
        case "L2-3P": return 70;
        default: return 50;
    }
};

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Clear existing data
        await User.deleteMany({});
        await Station.deleteMany({});
        await Charger.deleteMany({});
        await Vehicle.deleteMany({});
        await Booking.deleteMany({});

        console.log("Cleared old data");

        // --- Users ---
        const usersToCreate = [
            { name: "John Silva", email: "admin@ems.lk", role: "admin" }, // Admin
            { name: "Maria Fernando", email: "maria@ems.lk", role: "user" },
            { name: "Rajesh Kumar", email: "rajesh@ems.lk", role: "user" },
            { name: "Priya Perera", email: "priya@ems.lk", role: "user" },
            { name: "Kamal De Silva", email: "kamal@ems.lk", role: "user" },
            { name: "Nimali Bandara", email: "nimali@ems.lk", role: "user" },
            { name: "Saman Kumara", email: "saman@ems.lk", role: "user" },
            { name: "Dilani Weerasinghe", email: "dilani@ems.lk", role: "user" },
            { name: "Kasun Jayasuriya", email: "kasun@ems.lk", role: "user" },
            { name: "Tharindu Gamage", email: "tharindu@ems.lk", role: "user" }
        ];

        const users = [];
        for (const u of usersToCreate) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const user = await User.create({
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
                phone: `+9477${Math.floor(1000000 + Math.random() * 9000000)}`
            });
            users.push(user);
        }
        console.log(`${users.length} Users seeded`);

        // --- Vehicles ---
        const vehicleModels = [
            { make: "Tesla", model: "Model 3" },
            { make: "Nissan", model: "Leaf" },
            { make: "BMW", model: "i3" },
            { make: "Hyundai", model: "Kona Electric" },
            { make: "MG", model: "ZS EV" }
        ];

        const vehicles = [];
        for (const user of users) {
            // Assign 1-2 vehicles per user
            const count = Math.random() > 0.7 ? 2 : 1;
            for (let i = 0; i < count; i++) {
                const model = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
                const vehicle = await Vehicle.create({
                    userId: user._id,
                    type: "EV",
                    make: model.make,
                    model: model.model,
                    plateNumber: `CA${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`
                });
                vehicles.push(vehicle);
                await User.findByIdAndUpdate(user._id, { $push: { vehicles: vehicle._id } });
            }
        }
        console.log(`${vehicles.length} Vehicles seeded`);

        // --- Stations & Chargers ---
        const chargers = []; // Store all chargers for booking creation
        for (const s of stationsData) {
            const { chargers: stationChargers, id, location, ...extraFields } = s;

            const station = await Station.create({
                name: `${location} Station`,
                location: location,
                status: "Active",
                totalChargers: stationChargers.length,
                availableChargers: stationChargers.filter(c => c.status === "Available").length,
                image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80",
                ...extraFields
            });

            for (const c of stationChargers) {
                const charger = await Charger.create({
                    stationId: station._id,
                    name: `Charger ${c.id}`,
                    type: c.chargerType,
                    power: c.power,
                    connectorType: "CCS2",
                    pricePerHour: getPrice(c.chargerType),
                    status: c.status
                });
                chargers.push(charger);
            }
        }
        console.log("Stations & Chargers seeded");

        // --- Bookings ---
        // Generate 50+ bookings
        // Mix of Past, Active, Future
        const bookings = [];
        const now = new Date();

        for (let i = 0; i < 60; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const vehicle = await Vehicle.findOne({ userId: user._id }); // Get one of their vehicles
            if (!vehicle) continue;

            const charger = chargers[Math.floor(Math.random() * chargers.length)];

            // Random date within last 30 days or next 7 days
            const dayOffset = Math.floor(Math.random() * 37) - 30; // -30 to +6
            const bookingDate = new Date();
            bookingDate.setDate(now.getDate() + dayOffset);

            // Random start hour (8 AM to 8 PM)
            const startHour = 8 + Math.floor(Math.random() * 12);
            bookingDate.setHours(startHour, 0, 0, 0);

            const durationHours = 1 + Math.floor(Math.random() * 3); // 1-3 hours
            const startTime = new Date(bookingDate);
            const endTime = new Date(bookingDate);
            endTime.setHours(startHour + durationHours);

            let status = "Completed";
            if (startTime > now) status = "Booked"; // Future
            else if (endTime > now && startTime < now) status = "Active"; // Currently happening
            else status = "Completed"; // Past

            // Randomly cancel some
            if (Math.random() > 0.9) status = "Cancelled";

            const totalCost = durationHours * (charger.pricePerHour || 50);

            await Booking.create({
                userId: user._id,
                vehicleId: vehicle._id,
                chargerId: charger._id,
                startTime,
                endTime,
                status,
                totalCost
            });
        }
        console.log("Bookings seeded");

        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
