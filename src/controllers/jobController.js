import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { createNotification } from "./notificationController.js";

// POST /api/jobs/trigger-reminders
// Simulates a cron job running every hour to check for upcoming bookings
export const triggerReminders = async (req, res) => {
    try {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        // Find bookings starting in the next hour
        const upcomingBookings = await Booking.find({
            startTime: { $gte: now, $lte: oneHourLater },
            status: "Booked"
        }).populate("chargerId");

        let count = 0;
        for (const booking of upcomingBookings) {
            await createNotification(
                booking.userId,
                "Booking Reminder",
                `Your charging session at ${booking.chargerId?.name || 'Station'} starts soon (${new Date(booking.startTime).toLocaleTimeString()}).`,
                "info",
                "bookingReminder"
            );
            count++;
        }

        res.json({ message: `Triggered ${count} reminders.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/jobs/trigger-peak-hour
// Simulates a system-wide alert
export const triggerPeakHour = async (req, res) => {
    try {
        const users = await User.find();
        let count = 0;
        for (const user of users) {
            await createNotification(
                user._id,
                "Peak Hour Alert",
                "Peak hours are starting now. Rates are slightly higher until 8 PM.",
                "warning",
                "peakHour"
            );
            count++;
        }
        res.json({ message: `Sent peak hour alert to ${count} users.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
