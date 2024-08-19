import SubmissionState from "../models/SubmissionState.js";

export const getSubmissionState = async (req, res) => {

  try {
    const state = await SubmissionState.findOne();
    res.json(state);
    

  } catch (error) {
    console.error("Error fetching submission state:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSubmissionState = async (req, res) => {
  const { isOpen, cutoffDateTime } = req.body;
  try {

    const state = await SubmissionState.findOneAndUpdate(
      {},
      { isOpen, cutoffDateTime },
      { new: true, upsert: true }
    );
    res.json(state);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
