import express from "express";
import { triggerReminders, triggerPeakHour } from "../controllers/jobController.js";

const router = express.Router();

// Notes: In production, these should be protected or internal-only.
// For demo, we leave them open or just require general auth if easy.
// We'll leave them open for easy curl testing.

router.post("/trigger-reminders", triggerReminders);
router.post("/trigger-peak-hour", triggerPeakHour);

export default router;
