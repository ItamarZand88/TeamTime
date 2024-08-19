// src/controllers/configController.js
import Config from "../models/Config.js";

// Save configuration
export const saveConfig = async (req, res) => {
  const { shifts } = req.body;

  try {
    const updatedConfig = await Config.findOneAndUpdate(
      {}, // This finds the first document in the collection
      { shifts },
      { new: true, upsert: true } // new: true returns the updated document, upsert: true creates a new doc if none exists
    );
    res.status(200).json(updatedConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get configuration
export const getConfig = async (req, res) => {
  try {
    const config = await Config.find();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update configuration by ID
export const updateConfig = async (req, res) => {
  const { shifts } = req.body;

  try {
    const updatedConfig = await Config.findByIdAndUpdate(
      req.params.id,
      { shifts },
      { new: true }
    );
    res.json(updatedConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete configuration by ID
export const deleteConfig = async (req, res) => {
  try {
    await Config.findByIdAndDelete(req.params.id);
    res.json({ message: "Configuration deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
