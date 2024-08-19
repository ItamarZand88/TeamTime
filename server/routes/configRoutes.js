// src/routes/configRoutes.js
import express from "express";
import {
  saveConfig,
  getConfig,
  updateConfig,
  deleteConfig,
} from "../controllers/configController.js";

const router = express.Router();

router.put("/", saveConfig); // Save configuration
router.get("/", getConfig); // Get configuration
router.put("/:id", updateConfig); // Update configuration by ID
router.delete("/:id", deleteConfig); // Delete configuration by ID

export default router;
