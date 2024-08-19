import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeesTable from "../../components/adminComponents/EmployeesTable";
import { toast } from "react-toastify";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSpring, animated } from "react-spring";
import { useAuth } from "../../contexts/AuthProvider"; // Ensure this path is correct
import moment from "moment-timezone";

const apiUrl = import.meta.env.VITE_API_URL;

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    position: "",
    email: "",
    username: "",
    password: "",
    maximumShifts: 5,
  });
  const [editing, setEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [shiftsDialogOpen, setShiftsDialogOpen] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const { token } = useAuth();

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  useEffect(() => {
    if (token) {
      fetchEmployeesWithStatus();
    }
  }, [token]);

  const fetchEmployeesWithStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shiftRequests/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees with status:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        // Implement a function to handle logout or session expiration
      } else {
        toast.error("Failed to load employees!");
      }
    }
  };

  const handleClickOpen = (employee) => {
    if (employee) {
      setNewEmployee({
        id: employee._id,
        name: employee.name,
        position: employee.position,
        email: employee.email,
        username: employee.username || "",
        password: "",
        maximumShifts: employee.maximumShifts,
      });
      setEditing(true);
    } else {
      setNewEmployee({
        id: "",
        name: "",
        position: "",
        email: "",
        username: "",
        password: "",
        maximumShifts: 5,
      });
      setEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateEmployee = async () => {
    const method = editing ? "put" : "post";
    const url = editing
      ? `${apiUrl}/api/users/${newEmployee.id}`
      : `${apiUrl}/api/users`;

    try {
      await axios[method](
        url,
        {
          ...newEmployee,
          userType: "employee",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        editing
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );
      fetchEmployeesWithStatus();
      setOpen(false);
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      toast.error("Failed to add/update employee!");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee deleted successfully!");
      fetchEmployeesWithStatus();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee!");
    }
  };
  const handleViewShifts = async (employeeId) => {
    try {
      const weekStart = moment()
        .tz("Asia/Jerusalem")
        .startOf("week")
        .add(1, "weeks")
        .format("YYYY-MM-DD");
      const response = await axios.get(
        `${apiUrl}/api/shiftRequests/employee/${employeeId}`,
        {
          params: { weekStart },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        setSelectedShifts(response.data);
        setSelectedEmployee(employees.find((emp) => emp._id === employeeId));
        setShiftsDialogOpen(true);
      } else {
        toast.info("No shifts submitted for this employee.");
      }
    } catch (error) {
      console.error("Error fetching submitted shifts:", error);
      toast.error("Failed to load submitted shifts!");
    }
  };
  if (!token) {
    return (
      <Typography variant="h6">Please log in to view this page.</Typography>
    );
  }

  return (
    <animated.div style={fade}>
      <EmployeesTable
        employees={employees}
        onEdit={handleClickOpen}
        onDelete={handleDeleteEmployee}
        onViewShifts={handleViewShifts}
      />
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 46, right: 46 }}
        onClick={() => handleClickOpen(null)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editing ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
        <DialogContent>
          {!editing && (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                name="username"
                value={newEmployee.username}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                name="password"
                value={newEmployee.password}
                onChange={handleChange}
              />
            </>
          )}
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={newEmployee.name}
            onChange={handleChange}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position"
              name="position"
              value={newEmployee.position}
              onChange={handleChange}
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Chef">Chef</MenuItem>
              <MenuItem value="Waiter">Waiter</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={newEmployee.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="maximumShifts"
            label="Maximum Shifts"
            type="number"
            fullWidth
            variant="standard"
            name="maximumShifts"
            value={newEmployee.maximumShifts}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddOrUpdateEmployee}>
            {editing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shiftsDialogOpen}
        onClose={() => setShiftsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEmployee
            ? `${selectedEmployee.name}'s Submitted Shifts`
            : "Submitted Shifts"}
        </DialogTitle>
        <DialogContent>
          {selectedShifts
            .filter((shift) => shift.available)
            .map((shift, index) => (
              <div key={index}>
                <Typography>
                  Date:{" "}
                  {moment(shift.date)
                    .tz("Asia/Jerusalem")
                    .format("MMMM D, YYYY")}
                </Typography>
                <Typography>Shift: {shift.type}</Typography>
                <Typography>
                  Available: {shift.available ? "Yes" : "No"}
                </Typography>
                <hr />
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShiftsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </animated.div>
  );
}

export default Employees;
