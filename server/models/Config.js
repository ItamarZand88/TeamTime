import mongoose from "mongoose";

const { Schema } = mongoose;

export const shiftTypes = ["Morning", "Evening", "Night"];

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const configSchema = new Schema({
  shifts: [
    {
      shiftDetail: { type: String, enum: shiftTypes, required: true },
      day: { type: String, enum: daysOfWeek, required: true },
      startTime: {
        type: String,
        required: true,
        default: function () {
          if (this.shiftDetail === "Morning") {
            return "08:00";
          } else if (this.shiftDetail === "Evening") {
            return "14:00";
          } else {
            return "20:00";
          }
        },
      },
      endTime: {
        type: String,
        required: true,
        default: function () {
          if (this.shiftDetail === "Morning") {
            return "14:00";
          } else if (this.shiftDetail === "Evening") {
            return "20:00";
          } else {
            return "23:59";
          }
        },
      },
      numberOfEmployees: { type: Number, required: true },
    },
  ],
});

const Config = mongoose.model("Config", configSchema);

export default Config;
