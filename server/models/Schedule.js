import mongoose from "mongoose";

const { Schema } = mongoose;

const scheduleSchema = new mongoose.Schema({
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shift" }],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  algorithmResult: { type: mongoose.Schema.Types.Mixed },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
