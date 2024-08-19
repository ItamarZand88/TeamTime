import React, { useCallback, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import DroppableCell from "./DroppableCell";
import moment from "moment-timezone";
import EmployeeSkeletonBox from "../loadingComponents/EmployeeSkeletonBox";

function ShiftTable({
  shifts,
  employees,
  draggedItem,
  startDate,
  availableShifts,
  isAlgorithmLoading,
  onDeleteEmployeeFromShift,
}) {
  useEffect(() => {
    console.log("ShiftTable: shifts or employees changed", {
      shifts,
      employees,
    });
  }, [shifts, employees]);

  const theme = useTheme();
  const getEmployeeById = useCallback(
    (id) => {
      const employee = employees.find((e) => e._id === id);
      return employee;
    },
    [employees]
  );

  const endDate = moment(startDate).tz("Asia/Jerusalem").add(6, "days");

  const daysOfWeek = [];
  for (
    let m = moment(startDate).tz("Asia/Jerusalem");
    m.isSameOrBefore(endDate);
    m.add(1, "days")
  ) {
    daysOfWeek.push(moment(m));
  }

  const shiftTypes = ["Morning", "Evening", "Night"];

  const shiftMap = shifts.reduce((acc, shift) => {
    const shiftDate = moment(shift.date)
      .tz("Asia/Jerusalem")
      .format("YYYY-MM-DD");
    const key = `${shiftDate}-${shift.type}`;
    acc[key] = shift;
    return acc;
  }, {});

  const availableShiftsArray = Object.keys(availableShifts).map((shiftId) => ({
    _id: shiftId,
    numberOfEmployees: availableShifts[shiftId],
  }));

  const availableShiftsMap = useMemo(() => {
    const map = {};
    availableShiftsArray.forEach((shift) => {
      const key = `${shift._id}`; // Update this to match your key structure if necessary
      map[key] = shift.numberOfEmployees;
    });
    return map;
  }, [availableShiftsArray]);

  return (
    <TableContainer component={Paper} sx={{ border: "2px solid black" }}>
      <Table
        sx={{
          minWidth: 650,
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                borderRight: `1px solid ${theme.palette.divider}`,
                width: "10%",
              }}
            >
              Shift
            </TableCell>
            {daysOfWeek.map((day) => (
              <TableCell
                key={day.format("YYYY-MM-DD")}
                align="center"
                sx={{
                  fontWeight: "bold",
                  borderRight: `1px solid ${theme.palette.divider}`,
                  width: `${90 / daysOfWeek.length}%`,
                }}
              >
                {day.format("ddd, MMM D")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {shiftTypes.map((type) => (
            <TableRow key={type}>
              <TableCell
                component="th"
                scope="row"
                align="center"
                sx={{
                  fontWeight: "bold",
                  borderRight: `1px solid ${theme.palette.divider}`,
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TableCell>
              {daysOfWeek.map((day) => {
                const cellKey = `${day.format("YYYY-MM-DD")}-${type}`;
                const shift = shiftMap[cellKey] || { employees: [] };
                const availableEmployees = availableShiftsMap[cellKey] || 0;
                const isDisabled = availableEmployees === 0;
                return isAlgorithmLoading ? (
                  <TableCell key={cellKey}>
                    <EmployeeSkeletonBox />
                  </TableCell>
                ) : (
                  <DroppableCell
                    key={cellKey}
                    id={cellKey}
                    employees={shift.employees || []}
                    allEmployees={employees}
                    draggedItem={draggedItem}
                    getEmployeeById={getEmployeeById}
                    onDeleteEmployeeFromShift={onDeleteEmployeeFromShift}
                    requiredEmployees={availableEmployees}
                    sx={{
                      align: "center",
                      borderRight: `1px solid ${theme.palette.divider}`,
                    }}
                    isDisabled={isDisabled}
                    currentEmployees={
                      shift.employees ? shift.employees.length : 0
                    }
                  />
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ShiftTable;
