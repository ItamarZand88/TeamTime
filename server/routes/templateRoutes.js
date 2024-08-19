import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController.js";
import { authenticateJwt } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateJwt, createTemplate);
router.get("/", authenticateJwt, getTemplates);
router.get("/:id", authenticateJwt, getTemplateById);
router.put("/:id", authenticateJwt, updateTemplate);
router.delete("/:id", authenticateJwt, deleteTemplate);

export default router;
