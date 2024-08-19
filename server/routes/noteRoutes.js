import express from "express";
import {
  getAllNotes,
  createNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);

export default router;
