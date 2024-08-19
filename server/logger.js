// logger.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // ES module way to get directory name
const logFilePath = path.join(__dirname, "log.txt");
function log(...messages) {
  const timestamp = moment().format("YYYY-DD-MM HH:mm"); // Custom readable timestamp format
  const formattedMessages = messages.map((msg) =>
    typeof msg === "object" ? JSON.stringify(msg, null, 2) : msg
  );
  const logEntry = `${timestamp} - ${formattedMessages.join(" ")}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
}
export default log; // ES Module export
