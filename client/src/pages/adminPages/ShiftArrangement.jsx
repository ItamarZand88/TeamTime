import React, { useState, useEffect } from "react";
import ShiftTable from "../../components/adminComponents/ShiftTable";
import EmployeeCardInPool from "../../components/adminComponents/EmployeeCardInPool";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import EmployeePool from "../../components/adminComponents/EmployeePool";
import {
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
} from "@mui/material";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { gridSpacing } from "../../store/constant";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import SyncIcon from "@mui/icons-material/Sync";
import { blue } from "@mui/material/colors";
import { useAuth } from "../../contexts/AuthProvider";
import { SlideTabs } from "../../components/adminComponents/SlideTabs";
import "../../components/adminComponents/styles/SlideTabs.css";

const apiUrl = import.meta.env.VITE_API_URL;

const buttonStyles = {
  position: "fixed",
  bottom: 20,
  borderRadius: "8px",
  backgroundColor: "#1976d214",
  color: "#ffffff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "6px 12px",
  fontSize: "0.875rem",
  textTransform: "none",
  transition: "background-color 0.3s ease",
  border: "1.5px solid black",
};

function ShiftArrangement() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All");
  const [draggedItem, setDraggedItem] = useState(null);
  const [algorithmResults, setAlgorithmResults] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().tz("Asia/Jerusalem").startOf("week").day(0)
  );
  const [availableShifts, setAvailableShifts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [isLoadingAlgorithm, setIsLoadingAlgorithm] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 300,
  });

  useEffect(() => {
    fetchData();
  }, [weekOffset]);

  const handleTabClick = (tab) => {
    switch (tab) {
      case "prev":
        setWeekOffset(-1);
        break;
      case "current":
        setWeekOffset(0);
        break;
      case "next":
        setWeekOffset(1);
        break;
      default:
        break;
    }
  };

  const fetchData = async () => {
    try {
      const weekStart = moment()
        .tz("Asia/Jerusalem")
        .add(weekOffset, "weeks")
        .startOf("week")
        .day(0);

      // Fetch schedule first
      const scheduleResponse = await axios.get(`${apiUrl}/api/schedules`, {
        params: {
          weekOffset,
          weekStart: weekStart.format("YYYY-MM-DD"),
        },
      });

      setSchedule(scheduleResponse.data);
      setCurrentWeekStart(weekStart);

      // Fetch employees and shifts only if schedule is available
      if (scheduleResponse.data) {
        const [employeesResponse, shiftsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/users`, {
            params: { userType: "employee" },
          }),
          axios.get(`${apiUrl}/api/shifts`, {
            params: {
              weekOffset,
              weekStart: weekStart.format("YYYY-MM-DD"),
            },
          }),
        ]);

        setEmployees(employeesResponse.data);
        setShifts(shiftsResponse.data);

        if (shiftsResponse.data && shiftsResponse.data.length > 0) {
          const availableShifts = {};

          shiftsResponse.data.forEach((shift) => {
            const key = `${moment(shift.date)
              .tz("Asia/Jerusalem")
              .format("YYYY-MM-DD")}-${shift.type}`;
            availableShifts[key] = shift.numberOfEmployees;
          });

          // Set available shifts state
          setAvailableShifts(availableShifts);
        }
      }
    } catch (error) {
      console.error("ShiftArrangement: Error fetching data:", error);
      toast.error("Failed to load data!");
    }
  };

  const handlePreviousWeek = () => {
    if (weekOffset !== -1) {
      setWeekOffset(-1);
    }
  };

  const handleNextWeek = () => {
    if (weekOffset !== 1) {
      setWeekOffset(1);
    }
  };

  const handleCurrentWeek = () => {
    setWeekOffset(0);
  };

  const handleRunAlgorithm = async () => {
    setIsLoadingAlgorithm(true);
    try {
      const weekStartDate = moment(currentWeekStart)
        .tz("Asia/Jerusalem")
        .format("YYYY-MM-DD");

      const response = await axios.post(
        `${apiUrl}/api/algoDemo/trigger-algorithm`,
        { weekStartDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Algorithm completed successfully!");
        setAlgorithmResults(response.data.results);
        await fetchData();
      } else {
        toast.error(
          `Algorithm failed: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error running algorithm:", error);
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error occurred";
      toast.error(`Failed to run the algorithm: ${errorMessage}`);
    } finally {
      setIsLoadingAlgorithm(false);
    }
  };

  const handleSaveShifts = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/schedules/${schedule._id}`,
        {
          scheduleId: schedule._id,
          shifts: schedule.shifts,
        }
      );

      if (response.status === 200 && response.data) {
        setSchedule(response.data);
        toast.success("Shifts saved successfully!");
      } else {
        throw new Error("Failed to save shifts");
      }
    } catch (error) {
      console.error("ShiftArrangement: Error saving shifts:", error);
      toast.error(`Failed to save shifts: ${error.message}`);
    }
  };

  const handleClearShifts = () => {
    if (schedule) {
      const clearedShifts = schedule.shifts.map((shift) => ({
        ...shift,
        employees: [],
      }));
      setSchedule({ ...schedule, shifts: clearedShifts });
      toast.info("All employee assignments have been cleared from shifts.");
    }
  };

  const handleDeleteEmployeeFromShift = (employeeShiftId) => {
    // Split the ID and rejoin the parts to correctly parse the shiftId and employeeId
    const parts = employeeShiftId.split("-");
    // Assuming the employee ID is always the last part
    const employeeId = parts.pop();
    // Rejoin the remaining parts to form the full shift ID
    const shiftId = parts.join("-");

    setSchedule((prevSchedule) => {
      const updatedShifts = prevSchedule.shifts.map((shift) => {
        // Use the full shift ID for comparison
        if (
          `${moment(shift.date).format("YYYY-MM-DD")}-${shift.type}` === shiftId
        ) {
          const filteredEmployees = shift.employees.filter(
            (emp) => emp._id !== employeeId
          );

          return {
            ...shift,
            employees: filteredEmployees,
          };
        }
        return shift;
      });

      const updatedSchedule = { ...prevSchedule, shifts: updatedShifts };
      return updatedSchedule;
    });
  };

  // const handleClearOneShift = (date, type) => {
  const handleRecreateSchedule = async () => {
    if (!schedule) {
      toast.error("No schedule found.");
      return;
    }

    // Close the confirmation dialog immediately
    handleCloseConfirmation();

    try {
      setLoading(true);

      const response = await axios.delete(
        `${apiUrl}/api/schedules/${schedule._id}`
      );

      // Fetch the new data after successfully deleting the schedule
      await fetchData();

      // Show success message after the data has been fetched and state updated
      toast.success(response.data.message);
    } catch (error) {
      toast.error(`Failed to recreate schedule: ${error.message}`);
      console.error("Error recreating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Schedule Recreation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            Are you sure you want to recreate the schedule?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will delete all shifts scheduled for next week and any
            requested shifts that may have been submitted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const filteredEmployees = employees.filter(
    (employee) => selectedRole === "All" || employee.position === selectedRole
  );

  const handleDragStart = (event) => {
    const employeeId = event.active.id.split("-").pop();

    setDraggedItem(employeeId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setDraggedItem(null);

    if (!over || !schedule) {
      return;
    }
    const [sourcePrefix, ...sourceRest] = active.id.split("-");
    const draggedEmployeeId = sourceRest.pop();
    const isFromPool = sourcePrefix === "pool";

    let sourceDate, sourceType;
    if (!isFromPool) {
      sourceType = sourceRest.pop();
      sourceDate = sourceRest.join("-");
      sourceDate = moment
        .tz(sourceDate, "MM-DD", "Asia/Jerusalem")
        .format("YYYY-MM-DD");
    }
    const [year, month, day, targetType] = over.id.split("-");
    const targetDate = `${year}-${month}-${day}`;

    if (sourceDate === targetDate && sourceType === targetType) {
      return;
    }

    const updatedShifts = schedule.shifts.map((shift) => {
      const shiftDate = moment(shift.date)
        .tz("Asia/Jerusalem")
        .format("YYYY-MM-DD");

      if (
        !isFromPool &&
        shiftDate === sourceDate &&
        shift.type === sourceType
      ) {
        return {
          ...shift,
          employees: shift.employees.filter((e) => e._id !== draggedEmployeeId),
        };
      }
      if (shiftDate === targetDate && shift.type === targetType) {
        if (shift.employees.some((e) => e._id === draggedEmployeeId)) {
          toast.error("Employee already scheduled for this shift.", {
            position: "bottom-center",
          });
          return shift;
        }
        const employeeToAdd = employees.find(
          (e) => e._id === draggedEmployeeId
        );
        if (!employeeToAdd) {
          console.error("Employee not found in employees list");
          return shift;
        }
        return {
          ...shift,
          employees: [...shift.employees, employeeToAdd],
        };
      }
      return shift;
    });
    setSchedule({ ...schedule, shifts: updatedShifts });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <animated.div style={fade}>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Grid container spacing={gridSpacing} style={{ height: "100%" }}>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SlideTabs
                onTabClick={handleTabClick}
                activeTab={
                  weekOffset === 0
                    ? "current"
                    : weekOffset > 0
                    ? "next"
                    : "prev"
                }
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={1.5}>
            <EmployeePool
              filteredEmployees={filteredEmployees}
              setSelectedRole={setSelectedRole}
              selectedRole={selectedRole}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={10.5}>
            {schedule &&
              schedule.shifts &&
              schedule.shifts.length > 0 &&
              schedule.weekStartDate && (
                <ShiftTable
                  shifts={schedule.shifts}
                  availableShifts={availableShifts || []}
                  employees={employees}
                  draggedItem={draggedItem}
                  startDate={new Date(schedule.weekStartDate)}
                  isAlgorithmLoading={isLoadingAlgorithm}
                  onDeleteEmployeeFromShift={handleDeleteEmployeeFromShift}
                />
              )}
          </Grid>
        </Grid>
        <Tooltip title="Save shifts" arrow>
          <Fab
            color="primary"
            aria-label="save"
            style={{ ...buttonStyles, bottom: 20, right: 40 }}
            onClick={handleSaveShifts}
          >
            <SendIcon sx={{ color: blue[700] }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Clear shifts" arrow>
          <Fab
            color="secondary"
            aria-label="delete"
            style={{ ...buttonStyles, bottom: 20, right: 110 }}
            onClick={handleClearShifts}
          >
            <ClearIcon sx={{ color: blue[700] }} />
          </Fab>
        </Tooltip>
        <div>
          <Tooltip title="Recreate schedule from setup" arrow>
            <Fab
              color="inherit"
              aria-label="Sync data"
              style={{ ...buttonStyles, bottom: 20, right: 180 }}
              onClick={handleOpenConfirmation}
              disabled={loading}
            >
              <SyncIcon sx={{ color: blue[700] }} />
            </Fab>
          </Tooltip>
          <ConfirmationDialog
            open={openConfirmation}
            onClose={handleCloseConfirmation}
            onConfirm={handleRecreateSchedule}
          />
        </div>
        <Tooltip title="Run algorithm" arrow>
          <Fab
            color="inherit"
            aria-label="generate"
            style={{ ...buttonStyles, bottom: 20, right: 250 }}
            onClick={handleRunAlgorithm}
          >
            <AutoFixHighIcon sx={{ color: blue[700] }} />
          </Fab>
        </Tooltip>
        <DragOverlay dropAnimation={null}>
          {draggedItem && (
            <EmployeeCardInPool id={draggedItem}>
              {(() => {
                const employee = employees.find(
                  (emp) => emp._id === draggedItem
                );
                return employee ? employee.name : "Unknown Employee";
              })()}
            </EmployeeCardInPool>
          )}
        </DragOverlay>
      </DndContext>
    </animated.div>
  );
}

export default ShiftArrangement;
