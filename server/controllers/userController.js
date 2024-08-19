// controllers/employeeController.js
import User from "../models/User.js";

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ userType: "employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const employee = new User({
      username: req.body.username,
      password: req.body.password,
      userType: "employee",
      name: req.body.name,
      position: req.body.position,
      email: req.body.email,
      maximumShifts: req.body.maximumShifts,
    });

    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single employee by id
export const getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Cannot find employee" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee by id
export const updateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.userType === "employee") {
      user.username = req.body.username || user.username;
      if (req.body.password) {
        user.password = req.body.password; // This will trigger the 'pre' save hook to hash the password
      }
      user.name = req.body.name || user.name;
      user.position = req.body.position || user.position;
      user.email = req.body.email || user.email;
      user.maximumShifts = req.body.maximumShifts || user.maximumShifts;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res
        .status(404)
        .json({ message: "Employee not found or not an employee" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by id
export const deleteEmployee = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Deleted Employee" });
    } else {
      res.status(404).json({ message: "Cannot find employee" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
