import express from "express";
import { passport } from "./config/passport.js";
import cors from "cors";
import "./config/db.js"; // Ensure the path matches where your db.js file is located
import shiftRoutes from "./routes/shiftRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import shiftRequestRoutes from "./routes/shiftRequestRouts.js";
import submitShiftsRoutes from "./routes/submitShiftsRoutes.js";
import algoDemoRoutes from "./routes/algoDemoRoutes.js"; // Corrected import for algoDemoRoutes
import configRoutes from "./routes/configRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import log from "./logger.js"; // Corrected import for logger
import SubmissionStateRoutes from "./routes/submissionStateRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(passport.initialize());
app.use(errorHandler);

// Routes
app.use("/api/shifts", shiftRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/submitShifts", submitShiftsRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/submissionState", SubmissionStateRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/shiftRequests", shiftRequestRoutes);

app.use("/api/algoDemo", algoDemoRoutes); 
app.use("/api/schedules", scheduleRoutes);
app.use("/api/config", configRoutes);

// A simple test route
app.get("/", (req, res) => {
  log("Received a request on the root path");
  res.send("Hello World! The API is working.");
});


// Start the server
app.listen(port, () => {
  log(`Server listening at http://localhost:${port}`);
});
