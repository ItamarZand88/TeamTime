import Shift from "../models/Shift.js";
import log from "../logger.js";
import passport from "passport";
import moment from "moment-timezone";

export const createShift = async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    await newShift.save();
    log(`Shift created: ${JSON.stringify(newShift)}`);
    res.status(201).json(newShift);
  } catch (error) {
    log(`Error creating shift: ${error}`);
    res.status(400).send(error);
  }
};

export const updateShift = async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    log(`Shift updated: ${req.params.id}`);
    res.json(updatedShift);
  } catch (error) {
    log(`Error updating shift: ${error}`);
    res.status(400).send(error);
  }
};

export const deleteShift = async (req, res) => {
  try {
    const deletedShift = await Shift.findByIdAndDelete(req.params.id);
    if (!deletedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    log(`Shift deleted: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    log(`Error deleting shift: ${error}`);
    res.status(400).send(error);
  }
};
export const getMyShifts = async (req, res) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      if (error || !user) {
        log("Authentication failed");
        return res.status(401).json({ message: "Unauthorized" });
      }
      try {
        const { weekStart } = req.query;
        if (!weekStart) {
          return res
            .status(400)
            .json({ message: "weekStart parameter is required" });
        }
        const startDate = moment
          .tz(weekStart, "Asia/Jerusalem")
          .startOf("week");
        const endDate = startDate.clone().endOf("week");

        log(
          `Fetching shifts for user ${
            user._id
          } from ${startDate.format()} to ${endDate.format()}`
        );

        const shifts = await Shift.find({
          employees: user._id,
          date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        }).populate("employees", "name");

        log(`Shifts retrieved for user ${user._id}: ${JSON.stringify(shifts)}`);
        res.json(shifts);
      } catch (error) {
        log(`Error fetching shifts for the employee: ${error}`);
        res
          .status(500)
          .json({ error: "Failed to retrieve shifts for the employee." });
      }
    }
  )(req, res);
};
export const getAllShifts = async (req, res) => {
  try {
    const { weekStart, weekOffset } = req.query;

    if (!weekStart || !weekOffset) {
      return res
        .status(400)
        .json({ message: "weekStart and weekOffset parameters are required" });
    }

    const startDate = moment
      .tz(weekStart, "Asia/Jerusalem")
      .startOf("week")
      .toDate();
    const endDate = moment(startDate)
      .tz("Asia/Jerusalem")
      .endOf("week")
      .toDate();

    let shifts = await Shift.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("employees", "name");

    if (shifts.length === 0) {
      return res.status(404).json({ message: "No shifts found" });
    }
    res.json(shifts);
  } catch (error) {
    log(`Error in getAllShifts: ${error}`);
    res
      .status(500)
      .json({ message: "Failed to retrieve shifts", error: error.message });
  }
};
