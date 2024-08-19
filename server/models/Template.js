import mongoose from "mongoose";

const shiftPatternSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    required: true,
  },
  shifts: [
    {
      type: {
        type: String,
        enum: ["morning", "afternoon", "night"],
        required: true,
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      requiredEmployees: { type: Number, required: true },
    },
  ],
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  shiftPatterns: [shiftPatternSchema],
});

const Template = mongoose.model("Template", templateSchema);
export default Template;
