import Schedule from "../models/Schedule.js";
import Shift from "../models/Shift.js";
import Config from "../models/Config.js";
import ShiftRequest from "../models/ShiftRequest.js"

import moment from "moment-timezone";
import log from "../logger.js";

const getDayName = (dateString) => {
  return moment(dateString).tz("Asia/Jerusalem").format("dddd");
};

const convertToDateTime = (timeString, shiftDate) => {
  const [hours, minutes] = timeString
    .split(":")
    .map((num) => parseInt(num, 10));
  return moment(shiftDate)
    .tz("Asia/Jerusalem")
    .set({
      hour: hours,
      minute: minutes,
      second: 0,
      millisecond: 0,
    })
    .toDate();
};
export const getScheduleForWeek = async (req, res) => {
  try {
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const startDate = moment()
      .tz("Asia/Jerusalem")
      .add(weekOffset, "weeks")
      .startOf("week")
      .startOf("day");
    const endDate = moment(startDate)
      .tz("Asia/Jerusalem")
      .endOf("week")
      .endOf("day");

    log(
      "[scheduleController.js] [getScheduleForWeek] week startDate",
      startDate.format()
    );
    log(
      "[scheduleController.js] [getScheduleForWeek] week endDate",
      endDate.format()
    );

    let schedule = await Schedule.findOne({
      weekStartDate: startDate.toDate(),
      weekEndDate: endDate.toDate(),
    }).populate({
      path: "shifts",
      populate: { path: "employees", select: "name position" },
    });

    if (!schedule || (schedule.shifts && schedule.shifts.length === 0)) {
      const config = await Config.findOne();
      const newShifts = [];

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayName = days[dayOfWeek];
        log("[scheduleController.js] dayName", dayName);

        const shiftsForDay = config.shifts.filter(
          (shift) => shift.day === dayName
        );

        const shiftDate = moment(startDate)
          .add(dayOfWeek, "days")
          .add(3, "hours");
        log("[scheduleController.js] shiftDate", shiftDate.format());

        for (let shiftConfig of shiftsForDay) {
          const newShift = new Shift({
            date: shiftDate.clone().toDate(),
            type: shiftConfig.shiftDetail,
            employees: [],
            startTime: shiftDate
              .clone()
              .set({
                hour: parseInt(shiftConfig.startTime.split(":")[0]) + 3,
                minute: parseInt(shiftConfig.startTime.split(":")[1]),
                second: 0,
                millisecond: 0,
              })
              .toDate(),
            endTime: shiftDate
              .clone()
              .set({
                hour: parseInt(shiftConfig.endTime.split(":")[0]) + 3,
                minute: parseInt(shiftConfig.endTime.split(":")[1]),
                second: 0,
                millisecond: 0,
              })
              .toDate(),
            day: dayName,
            numberOfEmployees: shiftConfig.numberOfEmployees,
          });

          log(
            "[scheduleController.js] [getScheduleForWeek] newShift",
            JSON.stringify(newShift)
          );
          log(
            "[scheduleController.js] [getScheduleForWeek] newShift._id",
            newShift._id.toString()
          );
          log(
            "[scheduleController.js] [getScheduleForWeek] newShift.date",
            moment(newShift.date).tz("Asia/Jerusalem").format()
          );
          log(
            "[scheduleController.js] [getScheduleForWeek] newShift.startTime",
            moment(newShift.startTime).tz("Asia/Jerusalem").format()
          );
          log(
            "[scheduleController.js] [getScheduleForWeek] newShift.endTime",
            moment(newShift.endTime).tz("Asia/Jerusalem").format()
          );
          log(
            "[scheduleController.js] [getScheduleForWeek] newShift.numberOfEmployees",
            newShift.numberOfEmployees.toString()
          );

          await newShift.save();
          newShifts.push(newShift._id);
        }
      }
      if (!schedule) {
        schedule = new Schedule({
          weekStartDate: startDate.toDate(),
          weekEndDate: endDate.toDate(),
          shifts: newShifts,
          status: "draft",
        });
        await schedule.save();
      } else {
        schedule.shifts = newShifts;
        await schedule.save();
      }

      schedule = await Schedule.findById(schedule._id).populate({
        path: "shifts",
        populate: { path: "employees", select: "name position" },
      });
    }

    res.json(schedule);
  } catch (error) {
    log("[scheduleController.js] [getScheduleForWeek] error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve schedule", error: error.message });
  }
};

export const updateScheduleStatus = async (req, res) => {
  try {
    const { scheduleId, status } = req.body;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { status },
      { new: true }
    ).populate({
      path: "shifts",
      populate: { path: "employees", select: "name position" },
    });
    res.json(updatedSchedule);
  } catch (error) {
    log(
      "[scheduleController.js] [updateScheduleStatus] Error updating schedule status: ",
      error
    );
    res.status(500).json({
      message: "Failed to update schedule status",
      error: error.message,
    });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId, shifts } = req.body;

    // Update each shift
    for (let shift of shifts) {
      await Shift.findByIdAndUpdate(shift._id, {
        employees: shift.employees.map((emp) => emp._id),
      });
    }

    // Update the Schedule document
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { shifts: shifts.map((shift) => shift._id) },
      { new: true }
    ).populate({
      path: "shifts",
      populate: { path: "employees", select: "name position" },
    });

    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Return all necessary information
    res.json({
      _id: updatedSchedule._id,
      status: updatedSchedule.status,
      weekStartDate: updatedSchedule.weekStartDate,
      weekEndDate: updatedSchedule.weekEndDate,
      shifts: updatedSchedule.shifts,
    });
  } catch (error) {
    log(
      "[scheduleController.js] [updateSchedule] Error updating schedule: ",
      error
    );
    res
      .status(500)
      .json({ message: "Failed to update schedule", error: error.message });
  }
};

export const deleteScheduleById = async (req, res) => {
  try {
    const scheduleId = req.params.id;

    let schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    const weekStartDate = schedule.weekStartDate;

    await ShiftRequest.deleteMany({ weekStart: weekStartDate });

    // Extract the shift ids from the schedule
    const shiftIds = schedule.shifts.map(shift => shift._id);

    // Delete all shifts associated with the schedule
    await Shift.deleteMany({ _id: { $in: shiftIds } });

    // Delete the schedule document itself
    await Schedule.deleteOne({ _id: scheduleId });

    res.status(200).json({ message: "Schedule and associated shifts deleted successfully" });
  } catch (error) {
    console.error("[scheduleController.js] [removeScheduleForWeek] Error removing schedule: ", error);
    res.status(500).json({ message: "Failed to update schedule", error: error.message });
  }
};

