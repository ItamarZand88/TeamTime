import mongoose from "mongoose";
//one shift request schema
const shiftDataSchema = new mongoose.Schema({
    shiftId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Shift" 
        },
    available: {
      type: Boolean,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
  });
  
  //full week shift per user request schema
  const shiftRequestSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maximumShifts: {
      type: Number,
      required: true,
    },
    requestedShifts: [shiftDataSchema],
    status: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    weekStart: {
      type: Date,
      required: true,
    },
  });
  
  shiftRequestSchema.index({ userId: 1, weekStart: 1 }, { unique: true });
  
  const ShiftRequest = mongoose.model("ShiftRequest", shiftRequestSchema);
  export default ShiftRequest;
  