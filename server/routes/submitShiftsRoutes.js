import express from "express";
import {
  generateNextWeekSchedule,
  submitShifts,
} from "../controllers/submitShiftsController.js";

const router = express.Router();

router.get("/next-week", generateNextWeekSchedule);

router.post("/submit", submitShifts);

export default router;
