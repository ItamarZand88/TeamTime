import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);
export default Note;
