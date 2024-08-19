import express from "express";
import {
  getSubmissionState,
  updateSubmissionState,
} from "../controllers/submissionStateController.js";

const router = express.Router();

router.get("/", getSubmissionState);
router.post("/", updateSubmissionState);

export default router;
