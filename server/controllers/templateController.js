import Template from "../models/Template.js";

export const createTemplate = async (req, res) => {
  try {
    const template = new Template({
      ...req.body,
      createdBy: req.user._id, // Assuming you have user info in req.user
    });
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().populate("createdBy", "name");
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate(
      "createdBy",
      "name"
    );
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(updatedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
