import express from "express";
import { getMyNotifications, markRead, getPreferences, updatePreferences, deleteAllNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.delete("/", deleteAllNotifications);
router.put("/:id/read", markRead);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

export default router;
