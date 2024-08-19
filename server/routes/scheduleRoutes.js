import express from "express";
import {
  getScheduleForWeek,
  updateScheduleStatus,
  updateSchedule,
  deleteScheduleById,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getScheduleForWeek);
router.put("/:id/status", updateScheduleStatus);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteScheduleById);

export default router;
