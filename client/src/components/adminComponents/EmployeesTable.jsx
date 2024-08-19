import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EmployeesTable = ({ employees, onEdit, onDelete, onViewShifts }) => {
  return (
    <TableContainer component={Paper} sx={{ border: "2px solid black" }}>
      <Table aria-label="employees table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Maximum Shifts</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Submission Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={employee._id} hover>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.email}</TableCell>

              <TableCell>{employee.maximumShifts}</TableCell>
              <TableCell align="center">
                {employee.hasSubmitted ? (
                  <Tooltip title="View Submitted Shifts">
                    <Fab
                      size="small"
                      onClick={() => onViewShifts(employee._id)}
                    >
                      <CheckCircleIcon color="primary" />
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="No Shifts Submitted">
                    <CheckCircleIcon color="disabled" />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(employee)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(employee._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeesTable;
