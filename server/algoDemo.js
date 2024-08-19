import moment from "moment-timezone";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import ShiftRequest from "./models/ShiftRequest.js";
import Shift from "./models/Shift.js";
import log from "./logger.js";
import Schedule from "./models/Schedule.js";

export async function transformAndRunAlgorithm(weekStartDate) {
  log(
    " [algoDemo] [transformAndRunAlgorithm] [Algorithm] ==================================================================="
  );
  log(
    `[algoDemo] [transformAndRunAlgorithm] [Algorithm] Starting algorithm for week starting: ${weekStartDate}`
  );

  try {
    const startDate = moment.tz(weekStartDate, "Asia/Jerusalem").startOf("week");
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Using week start date:",
      startDate.toString()
    );

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Fetching and transforming employee data..."
    );
    const employees = await fetchAndTransformEmployeeData(startDate);
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Fetched data for:",
      employees.length.toString(),
      "employees"
    );

    if (employees.length === 0) {
      log(
        "[algoDemo] [transformAndRunAlgorithm] [Algorithm] No employees found. Stopping algorithm."
      );
      return {
        success: false,
        message: "No employee shift requests found for the given week",
      };
    }

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Cleaning schedule employees..."
    );
    const schedule = await cleanScheduleEmployees(startDate);
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Schedule cleaned."
    );

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Fetching and transforming shift data..."
    );
    const shifts = await fetchAndTransformShiftData(startDate);
    log(
      `[algoDemo] [transformAndRunAlgorithm] [Algorithm] Fetched data for ${shifts.length} shifts`
    );

    if (shifts.length === 0) {
      log(
        "[algoDemo] [transformAndRunAlgorithm] [Algorithm] No shifts found. Stopping algorithm."
      );
      return { success: false, message: "No shifts found for the given week" };
    }

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Employee data:",
      employees
    );
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Shift data:",
      shifts
    );

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Running Python script..."
    );
    const result = await runPythonScript(employees, shifts);
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Python script execution completed"
    );
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Python script result:",
      result
    );

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Processing and saving results..."
    );
    const updatedSchedule = await processAndSaveResults(result, startDate);
    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Results processed and saved successfully"
    );

    log(
      "[algoDemo] [transformAndRunAlgorithm] [Algorithm] Algorithm completed successfully"
    );
    return {
      success: true,
      message: "Algorithm completed successfully",
      results: result,
      updatedSchedule: updatedSchedule,
    };
  } catch (error) {
    log(
      "[algoDemo] [transformAndRunAlgorithm] ^==ERROR==^ [Algorithm] Error running algorithm:",
      error
    );
    throw error;
  }
}
async function cleanScheduleEmployees(weekStartDate) {
 
    if (!weekStartDate) {
      throw new Error("weekStartDate is required");
    }

    const startDate = weekStartDate.clone();
    const endDate = startDate.clone().endOf("week");

    log(
      `[cleanScheduleEmployees] Cleaning schedules between ${startDate.format()} and ${endDate.format()}`
    );

    const schedules = await Schedule.find({
      weekStartDate: { $gte: startDate.toDate() },
      weekEndDate: { $lte: endDate.toDate() },
    }).populate("shifts");

    if (!schedules || schedules.length === 0) {
      throw new Error("No schedules found for the specified week");
    }

    const shiftUpdates = schedules.map(async (schedule) => {
      schedule.shifts.forEach(async (shift) => {
        shift.employees = []; // Clear employees array
        await shift.save();
      });
    });

    await Promise.all(shiftUpdates);

    const cleanedSchedules = await Schedule.find({
      weekStartDate:  startDate.toDate() ,
      weekEndDate: endDate.toDate(),
    }).populate("shifts");

    return cleanedSchedules;
  
};
async function fetchAndTransformEmployeeData(weekStartDate) {
  log(
    `[algoDemo] [fetchAndTransformEmployeeData] [Employees] Fetching employee data for week starting: ${weekStartDate.format()}`
  );
  try {
    const startDate = weekStartDate.clone();
    const endDate = startDate.clone().endOf("week");

    log(
      `[algoDemo] [fetchAndTransformEmployeeData] [Employees] Searching for shift requests between ${startDate.format()} and ${endDate.format()}`
    );

    const shiftRequests = await ShiftRequest.find({
      weekStart: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    }).populate("userId");

    log(
      `[algoDemo] [fetchAndTransformEmployeeData] [Employees] Found ${shiftRequests.length} shift requests`
    );

    const shifts = await Shift.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    log(
      `[algoDemo] [fetchAndTransformEmployeeData]  [Employees] Found ${shifts.length} shifts`
    );

    const transformedData = shiftRequests.map((request) => {
      const allShifts = shifts.map((shift) => ({
        shiftId: shift._id.toString(),
        available: false,
        day: moment(shift.date).tz("Asia/Jerusalem").format("dddd"),
      }));

      request.requestedShifts.forEach((requestedShift) => {
        const index = allShifts.findIndex(
          (s) => s.shiftId === requestedShift.shiftId.toString()
        );
        if (index !== -1) {
          allShifts[index].available = requestedShift.available;
        }
      });

      return {
        userId: request.userId._id.toString(),
        maximumShifts: request.maximumShifts,
        requestedShifts: allShifts,
      };
    });

    log(
      `[algoDemo] [fetchAndTransformEmployeeData] [Employees] Transformed data for ${transformedData.length} employees`
    );
    return transformedData;
  } catch (error) {
    log(
      "[algoDemo] [fetchAndTransformEmployeeData] ^==ERROR==^  [Employees] Error fetching and transforming employee data:",
      error
    );
    throw error;
  }
}

async function fetchAndTransformShiftData(weekStartDate) {
  log(
    `[algoDemo] [fetchAndTransformShiftData] [Shifts] Fetching shift data for week starting: ${weekStartDate.format()}`
  );
  try {
    const startDate = weekStartDate.clone();
    const endDate = startDate.clone().endOf("week");

    const shifts = await Shift.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    log(`[Shifts] Found ${shifts.length} shifts`);

    const transformedData = shifts.map((shift) => {
      const day = moment(shift.date).tz("Asia/Jerusalem").format("dddd");
      return {
        _id: shift._id.toString(),
        date: shift.date,
        type: shift.type,
        numberOfEmployees: shift.numberOfEmployees,
        day: day,
      };
    });

    log(
      `[algoDemo] [fetchAndTransformShiftData] [Shifts] Transformed data for ${transformedData.length} shifts`
    );
    return transformedData;
  } catch (error) {
    log(
      "[algoDemo] [fetchAndTransformShiftData] ^==ERROR==^ [Shifts] Error fetching and transforming shift data:",
      error
    );
    throw error;
  }
}

async function runPythonScript(employees, shifts) {
  log("[algoDemo] [runPythonScript] [Python] Preparing to run Python script");

  const tempDir = path.join(process.cwd(), "temp");
  await fs.mkdir(tempDir, { recursive: true });

  const employeesFile = path.join(tempDir, "employees.json");
  const shiftsFile = path.join(tempDir, "shifts.json");

  await fs.writeFile(employeesFile, JSON.stringify(employees));
  await fs.writeFile(shiftsFile, JSON.stringify(shifts));

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      "shift_algorithm.py",
      employeesFile,
      shiftsFile,
    ]);

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      log(
        "[algoDemo] [runPythonScript] [Python] Received data from Python script"
      );
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      log(
        "[algoDemo] [runPythonScript] ^==ERROR==^  [Python] Received error data from Python script"
      );
      stderrData += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      await fs.unlink(employeesFile).catch(console.error);
      await fs.unlink(shiftsFile).catch(console.error);

      if (code !== 0) {
        log(
          "[algoDemo] [runPythonScript] ^==ERROR==^ [Python] Python script exited with code",
          code
        );
        log("[algoDemo] [runPythonScript] ^==ERROR==^ stderr:", stderrData);
        reject(
          new Error(`Python script exited with code ${code}: ${stderrData}`)
        );
      } else {
        log(
          "[algoDemo] [runPythonScript] [Python] Python script completed successfully"
        );
        log(`[algoDemo] [runPythonScript] [Python] stdout: ${stdoutData}`);
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (error) {
          log(
            "[algoDemo] [runPythonScript] ^==ERROR==^ [Python] Error parsing Python script output:",
            error
          );
          reject(error);
        }
      }
    });
  });
}

async function processAndSaveResults(result, weekStartDate) {
  for (const assignment of result.assignments) {
    const shift = await Shift.findById(assignment.shift);
    if (shift) {
      if (!shift.employees) {
        shift.employees = [];
      }
      if (!shift.employees.includes(assignment.employee)) {
        shift.employees.push(assignment.employee);
        await shift.save();
      }
    } else {
      log(
        "[algoDemo] [processAndSaveResults] ^==WARNING==^ [Results] Shift not found for assignment:",
        assignment
      );
    }
  }
}
