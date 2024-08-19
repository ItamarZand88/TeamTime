import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import log from "../logger.js";

const router = express.Router();

// Register new admin
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, position, email, userType } = req.body;
    const user = new User({
      username,
      password,
      name,
      position,
      email,
      userType,
    });
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    console.error("Error details:", err);
    res
      .status(400)
      .json({ error: "Error registering new user.", details: err.message });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      "your_jwt_secret"
    );
    res.json({ user, token });
    log("User logged in:", user.username);
    log("Token:", token);
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res, next) => {
  res.json({ message: "Logged out" });
});

// Check authentication status
router.get("/status", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const user = await User.findById(decoded.id).select("-password"); // Ensure you don't send the password
    if (!user) {
      return res.status(404).json({ user: null });
    }
    res.json({ user });
  } catch (error) {
    res.status(401).json({ user: null });
  }
});

export default router;
