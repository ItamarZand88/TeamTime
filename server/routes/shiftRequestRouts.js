import express from "express";
import {
  getEmployeesWithSubmissionStatus,
  getEmployeeShifts,
  submitOrCreateShiftRequest,
  getShiftRequests,
  getShiftRequestById,
  updateShiftRequest,
  deleteShiftRequest,
} from "../controllers/shiftRequestController.js";
import { authenticateJwt } from "../middleware/auth.js";

const router = express.Router();

// Get all employees with their submission status
router.get("/status", authenticateJwt, getEmployeesWithSubmissionStatus);

// Get shifts for a specific employee
router.get("/employee/:employeeId", authenticateJwt, getEmployeeShifts);

// Submit or create a new shift request
router.post("/submit", authenticateJwt, submitOrCreateShiftRequest);

// Get all shift requests
router.get("/", authenticateJwt, getShiftRequests);

// Get a specific shift request by ID
router.get("/:id", authenticateJwt, getShiftRequestById);

// Update a shift request
router.put("/:id", authenticateJwt, updateShiftRequest);

// Delete a shift request
router.delete("/:id", authenticateJwt, deleteShiftRequest);

export default router;
