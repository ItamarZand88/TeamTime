import moment from "moment-timezone";
import log from "../logger.js";

export const generateNextWeekSchedule = async (req, res) => {
  try {
    const startDate = moment()
      .tz("Asia/Jerusalem")
      .startOf("week")
      .add(1, "weeks");
    const endDate = moment(startDate).tz("Asia/Jerusalem").endOf("week");

    log(
      "[submitShiftsController.js] [generateNextWeekSchedule] startDate",
      startDate
    );
    log(
      "[submitShiftsController.js] [generateNextWeekSchedule] endDate",
      endDate
    );

    const shifts = [];
    for (
      let date = startDate.clone();
      date.isBefore(endDate);
      date.add(1, "days")
    ) {
      shifts.push({
        date: date.format("YYYY-MM-DD"),
        shiftType: "morning",
        employeeId: null,
      });
      shifts.push({
        date: date.format("YYYY-MM-DD"),
        shiftType: "afternoon",
        employeeId: null,
      });
      shifts.push({
        date: date.format("YYYY-MM-DD"),
        shiftType: "night",
        employeeId: null,
      });
    }
    res.status(200).json(shifts);
  } catch (error) {
    console.error("Error generating schedule:", error);
    log(
      "[submitShiftsController.js] [generateNextWeekSchedule] Error generating schedule:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitShifts = async (req, res) => {
  try {
    // Assuming req.data contains the submitted shifts data

    log(
      "[submitShiftsController.js] [submitShifts] Shifts submitted:",
      req.data
    );

    // Add your business logic here

    // Send a success response
    res.status(200).json({ message: "Shifts submitted successfully" });
  } catch (error) {
    // Handle any errors that occur during processing
    console.error("Error submitting shifts:", error);

    // Send an error response
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};
