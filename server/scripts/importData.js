import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import process from "process";
import fs from "fs";
import Employee from "../models/Employee.js"; // Update the path as necessary

// Calculate the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("The MONGODB_URI is not set in the environment variables.");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB successfully with Mongoose"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

async function importData() {
  try {
    await Employee.deleteMany(); // Clears the existing entries

    const dataPath = path.join(
      __dirname,
      "../../client/src/assets/employees.json"
    ); // Update path as necessary
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    await Employee.insertMany(data);
    console.log("Data import successful");
    process.exit();
  } catch (error) {
    console.error("Failed to import data:", error);
    process.exit(1);
  }
}

importData();
