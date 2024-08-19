import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import process from "process";

// Calculate the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("The MONGODB_URI is not set in the environment variables.");
  process.exit(1);
}

// Function to connect to MongoDB with retry logic
function connectWithRetry() {
  mongoose
    .connect(uri, {
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    })
    .then(() => console.log("Connected to MongoDB successfully with Mongoose"))
    .catch((err) => {
      console.error("Could not connect to MongoDB:", err);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    });
}

connectWithRetry();
