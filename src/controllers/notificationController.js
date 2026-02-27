import Notification from "../models/Notification.js";

import User from "../models/User.js";

// Internal helper to create notification
export const createNotification = async (userId, title, message, type = "info", category = "bookingConfirmed") => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // Check if preference is enabled for this category
        // If specific preference is false, skip creation
        if (user.notificationPreferences && user.notificationPreferences[category] === false) {
            console.log(`Skipping notification for ${category} as user disabled it.`);
            return;
        }

        await Notification.create({ userId, title, message, type });
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
};

// GET /api/notifications/preferences
export const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.notificationPreferences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/notifications/preferences
export const updatePreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.notificationPreferences = { ...user.notificationPreferences, ...req.body };
        await user.save();

        res.json(user.notificationPreferences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/notifications
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/notifications/:id/read
export const markRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
// DELETE /api/notifications
export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });
        res.json({ message: "All notifications deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
