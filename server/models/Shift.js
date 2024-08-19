// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const shiftSchema = new mongoose.Schema({
//   shiftdetail: { type: String, required: true }, // e.g., "Morning", "Evening"
//   day: { type: String, required: true }, // e.g., "Monday", "Tuesday"
//   employees: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
// });

// // Default export of the model
// const Shift = mongoose.model("Shift", shiftSchema);
// export default Shift;
import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
    required: true,
  },
  day: { type: String, required: true },
  numberOfEmployees: { type: Number, required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
