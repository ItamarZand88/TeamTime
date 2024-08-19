import mongoose from "mongoose";


const submissionStateSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  cutoffDateTime: {
    type: Date,
    required: function () {
      return this.isOpen;
    },
  },

});

const SubmissionState = mongoose.model(
  "SubmissionState",
  submissionStateSchema
);
export default SubmissionState;
