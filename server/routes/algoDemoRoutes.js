import express from "express";
import { transformAndRunAlgorithm } from "../algoDemo.js";
import ShiftRequest from "../models/ShiftRequest.js";
import Shift from "../models/Shift.js";

const router = express.Router();

router.post("/trigger-algorithm", async (req, res) => {
  const { weekStartDate } = req.body;
  if (!weekStartDate) {
    return res.status(400).json({ error: "weekStartDate is required" });
  }

  try {
    const result = await transformAndRunAlgorithm(weekStartDate);
    res.status(200).json({
      success: true,
      message: "Algorithm completed successfully",
      results: result, // הוספנו את זה
    });
  } catch (error) {
    console.error("Error triggering algorithm:", error);
    res.status(500).json({
      success: false,
      error: "Error triggering algorithm",
      details: error.message,
    });
  }
});
// Endpoint to create shiftRequest
router.post("/createShiftAlgo", async (req, res) => {
  try {
    const newShiftRequest = new ShiftRequest(req.body);
    const savedShiftRequest = await newShiftRequest.save();
    res.status(201).json(savedShiftRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to create multiple ShiftAlgoDemo documents
router.post("/createBulkShhiftsAlgo", async (req, res) => {
  try {
    const shifts = req.body.shifts;
    const savedShifts = await Shift.insertMany(shifts);
    res.status(201).json(savedShifts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("CreateShiftRequests", async (req, res) => {
  try {
    const newShiftRequest = new ShiftRequest(req.body);
    const savedShiftRequest = await newShiftRequest.save();
    res.status(201).json(savedShiftRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/createBulkShiftRequests", async (req, res) => {
  try {
    const shiftRequests = req.body; // Assume req.body is an array of shift request objects
    const savedShiftRequests = await ShiftRequest.insertMany(shiftRequests);
    res.status(201).json(savedShiftRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
