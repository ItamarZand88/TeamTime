import express from "express";
import {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
  getMyShifts,
} from "../controllers/shiftController.js";
import { authenticateJwt } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllShifts);
router.post("/", createShift);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);
router.get("/myShifts", authenticateJwt, getMyShifts);
export default router;
