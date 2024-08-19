import log from "../logger.js";
import ShiftRequest from "../models/ShiftRequest.js";
import User from "../models/User.js";
import moment from "moment-timezone";
import Shift from "../models/Shift.js";

export const getEmployeesWithSubmissionStatus = async (req, res) => {
  try {
    const currentWeekStart = moment()
      .tz("Asia/Jerusalem")
      .startOf("week")
      .add(1, "weeks")
      .toDate();
    const currentWeekEnd = moment(currentWeekStart).endOf("week").toDate();

    const result = await User.aggregate([
      { $match: { userType: "employee" } },
      {
        $lookup: {
          from: "shiftrequests",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $gte: ["$weekStart", currentWeekStart] },
                    { $lte: ["$weekStart", currentWeekEnd] },
                  ],
                },
              },
            },
            { $project: { requestedShifts: 1, submittedAt: 1, status: 1 } },
          ],
          as: "shiftRequest",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          position: 1,
          maximumShifts: 1,
          hasSubmitted: { $gt: [{ $size: "$shiftRequest" }, 0] },
          submissionStatus: { $arrayElemAt: ["$shiftRequest.status", 0] },
          submittedAt: { $arrayElemAt: ["$shiftRequest.submittedAt", 0] },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching employees status:", error);
    res.status(500).json({
      message: "Error fetching employees status",
      error: error.message,
    });
  }
};
export const submitOrCreateShiftRequest = async (req, res) => {
  try {
    const { userId, requestedShifts, weekStart } = req.body;

    log(
      "[shiftRequestController] [submitOrCreateShiftRequest] Received shift submission request:",
      {
        userId,
        requestedShifts,
        weekStart,
      }
    );

    if (
      !userId ||
      !requestedShifts ||
      !Array.isArray(requestedShifts) ||
      !weekStart
    ) {
      log(
        "[shiftRequestController] [submitOrCreateShiftRequest] Invalid input"
      );
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) {
      log(
        "[shiftRequestController] [submitOrCreateShiftRequest] User not found"
      );
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure unique shifts
    const uniqueShifts = {};
    requestedShifts.forEach((shift) => {
      uniqueShifts[shift.shiftId] = shift;
    });

    const processedShifts = Object.values(uniqueShifts).map((shift) => ({
      shiftId: shift.shiftId,
      available: shift.available,
      day: shift.day,
    }));

    log(
      "[shiftRequestController] [submitOrCreateShiftRequest] Processed unique shifts:",
      processedShifts
    );

    const weekStartDate = moment
      .tz(weekStart, "Asia/Jerusalem")
      .startOf("week")
      .toDate();

    const shiftRequest = await ShiftRequest.findOneAndUpdate(
      { userId, weekStart: weekStartDate },
      {
        userId,
        requestedShifts: processedShifts,
        weekStart: weekStartDate,
        submittedAt: new Date(),
        status: "pending",
        maximumShifts: user.maximumShifts,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    log(
      "[shiftRequestController] [submitOrCreateShiftRequest] Shift request saved/updated:",
      shiftRequest
    );

    res
      .status(201)
      .json({ message: "Shift request submitted successfully", shiftRequest });
  } catch (error) {
    log("[shiftRequestController] [submitOrCreateShiftRequest] Error:", error);
    res.status(400).json({
      message: "Error submitting shift request",
      error: error.message,
    });
  }
};
export const getEmployeeShifts = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { weekStart } = req.query;

    log(
      "[ShiftRequestController] [getEmployeeShifts] Fetching shifts for employee:",
      employeeId
    );
    log("[ShiftRequestController] [getEmployeeShifts] Week start:", weekStart);

    if (!weekStart) {
      return res
        .status(400)
        .json({ message: "weekStart parameter is required" });
    }

    const startDate = moment.tz(weekStart, "Asia/Jerusalem").startOf("week");
    const endDate = startDate.clone().endOf("week");

    log(
      "[ShiftRequestController] [getEmployeeShifts] Searching for shifts between",
      startDate.format(),
      "and",
      endDate.format()
    );

    // Fetch all shifts for the week
    const shifts = await Shift.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).lean();

    log("[ShiftRequestController] [getEmployeeShifts] Found shifts:", shifts);

    // Fetch existing shift request if any
    const existingRequest = await ShiftRequest.findOne({
      userId: employeeId,
      weekStart: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    }).lean();

    log(
      "[ShiftRequestController] [getEmployeeShifts] Found existing request:",
      existingRequest
    );

    // Transform shifts to include availability information
    const transformedShifts = shifts.map((shift) => ({
      shiftId: shift._id,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type,
      day: moment(shift.date).format("dddd"),
      available: existingRequest
        ? existingRequest.requestedShifts.some(
            (reqShift) =>
              reqShift.shiftId.toString() === shift._id.toString() &&
              reqShift.available
          )
        : false, // If no existing request, default to not available
    }));

    if (transformedShifts.length === 0) {
      log(
        "[ShiftRequestController] [getEmployeeShifts] No shifts available for this week"
      );
      return res
        .status(200)
        .json({ message: "No shifts available for this week" });
    }

    res.json(transformedShifts);
  } catch (error) {
    console.error("Error in getEmployeeShifts:", error);
    log("[ShiftRequestController] [getEmployeeShifts] Error:", error);
    res.status(500).json({
      message: "Error fetching shifts for employee submission",
      error: error.message,
    });
  }
};

export const getShiftRequests = async (req, res) => {
  try {
    const shiftRequests = await ShiftRequest.find()
      .populate({
        path: "userId",
        select: "name", // Only populate the 'name' field of the related User document
      })
      .lean();
    res.json(shiftRequests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shift requests", error: error.message });
  }
};

export const getShiftRequestById = async (req, res) => {
  try {
    const shiftRequest = await ShiftRequest.findById(req.params.id)
      .populate("userId", "name")
      .lean();
    if (!shiftRequest) {
      return res.status(404).json({ message: "Shift request not found" });
    }
    res.json(shiftRequest);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shift request", error: error.message });
  }
};

export const updateShiftRequest = async (req, res) => {
  try {
    const { userId, weekStart } = req.body; // Assuming these are provided in req.body

    const updatedShiftRequest = await ShiftRequest.findOneAndUpdate(
      { _id: req.params.id, userId, weekStart }, // Query criteria including _id, userId, and weekStart
      req.body, // Update with the contents of req.body
      { new: true } // Return the updated document
    );

    if (!updatedShiftRequest) {
      return res.status(404).json({ message: "Shift request not found" });
    }

    res.json(updatedShiftRequest);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating shift request", error: error.message });
  }
};

export const deleteShiftRequest = async (req, res) => {
  try {
    const { weekStart } = req.body; // Assuming weekStart is provided in req.body
    const userId = req.params.id; // Assuming the userId is passed as a URL parameter

    const deletedShiftRequest = await ShiftRequest.findOneAndDelete({
      userId,
      weekStart,
    });

    if (!deletedShiftRequest) {
      return res.status(404).json({ message: "Shift request not found" });
    }

    res.json({ message: "Shift request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting shift request", error: error.message });
  }
};
