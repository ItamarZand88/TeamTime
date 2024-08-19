import express from "express";
import {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/userController.js";

const router = express.Router();

// Get all employees
router.get("/", getEmployees);

// Create a new employee
router.post("/", createEmployee);

// Get a single employee by id
router.get("/:id", getEmployee);

// Update an employee by id
router.put("/:id", updateEmployee);

// Delete an employee by id
router.delete("/:id", deleteEmployee);

export default router;
