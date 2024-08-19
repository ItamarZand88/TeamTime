// File: server/utils/shiftAllocationAlgorithm.js
import { PythonShell } from "python-shell";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function runShiftAllocationAlgorithm(employeesData, shiftsData) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "json",
      pythonPath: "python",
      scriptPath: __dirname,
      args: [JSON.stringify(employeesData), JSON.stringify(shiftsData)],
    };

    PythonShell.run(
      "shift_allocation_algorithm.py",
      options,
      (err, results) => {
        if (err) {
          console.error("Error running Python script:", err);
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}
