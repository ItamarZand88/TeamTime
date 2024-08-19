import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TableCell, Box, Typography, Tooltip } from "@mui/material";
import EmployeeCardInTable from "./EmployeeCardInTable";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";

function DroppableCell({
  id,
  employees,
  draggedItem,
  isDisabled,
  onDeleteEmployeeFromShift,
  requiredEmployees,
  currentEmployees,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const cellStyle = {
    verticalAlign: "top",
    height: "100%",
    padding: 8,
    position: "relative",
    transition: "all 0.3s ease",
    cursor: isDisabled ? "not-allowed" : "default",
    ...(isDisabled
      ? {
          backgroundImage: `repeating-linear-gradient(
          45deg,
          #f0f0f0,
          #f0f0f0 2px,
          #e8e8e8 2px,
          #e8e8e8 4px
        )`,
          backgroundSize: "6px 6px",
        }
      : {
          backgroundColor: isOver ? "#f7f7f7" : "white",
        }),
  };

  const dropIndicatorStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: "2px dashed #4a90e2",
    borderRadius: "8px",
    opacity: isOver ? 1 : 0,
    pointerEvents: "none",
    transition: "opacity 0.3s ease",
  };

  if (isDisabled) {
    return (
      <TableCell style={cellStyle}>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
        ></Typography>
      </TableCell>
    );
  }

  const tooltipContent = `${currentEmployees}/${requiredEmployees} employees`;

  const getStatusIcon = () => {
    if (currentEmployees > requiredEmployees) {
      return (
        <AddTaskOutlinedIcon
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            fontSize: "small",
            color: "blue",
            zIndex: 1,
            transition: "all 0.3s ease",
          }}
        />
      );
    } else if (currentEmployees === requiredEmployees) {
      return (
        <CheckOutlinedIcon
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            fontSize: "small",
            color: "green",
            zIndex: 1,
          }}
        />
      );
    } else {
      return (
        <InfoOutlinedIcon
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            fontSize: "small",
            color: "red",
            zIndex: 1,
          }}
        />
      );
    }
  };

  return (
    <TableCell ref={setNodeRef} style={cellStyle}>
      <Box style={dropIndicatorStyle} />
      <Tooltip title={tooltipContent} placement="top-end">
        {getStatusIcon()}
      </Tooltip>
      <Box style={{ marginBottom: "12px" }}>
        {employees.map((employee) => {
          if (!employee) {
            return null;
          }
          return (
            <EmployeeCardInTable
              key={employee._id}
              id={`${id}-${employee._id}`}
              name={employee.name}
              role={employee.position}
              isDragging={draggedItem === `${id}-${employee._id}`}
              onDeleteEmployeeFromShift={onDeleteEmployeeFromShift}
            />
          );
        })}
      </Box>
    </TableCell>
  );
}

export default DroppableCell;
