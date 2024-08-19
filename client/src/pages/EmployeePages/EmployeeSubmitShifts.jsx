import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleTable from "../../components/employeesComponents/ScheduleTable";
import {
  Grid,
  Typography,
  Alert,
  Fab,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthProvider";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import { blue } from "@mui/material/colors";
import { toast } from "react-toastify";
import moment from "moment-timezone";

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
  border: "2px solid black",
};

function EmployeeSubmitShifts() {
  const [mySchedule, setMySchedule] = useState({ shifts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionState, setSubmissionState] = useState({
    isOpen: false,
    cutoffDateTime: null,
  });
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch schedule
        const scheduleResponse = await axios.get(
          `${apiUrl}/api/schedules?weekOffset=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedSchedule = updateShifts(scheduleResponse.data);

        // Fetch submission state
        const submissionStateResponse = await axios.get(
          `${apiUrl}/api/submissionState`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedSubmissionState = submissionStateResponse.data;

        // Set submission state
        setSubmissionState(fetchedSubmissionState);

        // Fetch existing submissions
        await fetchExistingSubmission(fetchedSchedule);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (user && token) {
      fetchData();
    } else {
    }
  }, [user, token]);

  function updateShifts(data) {
    if (!data || !Array.isArray(data.shifts)) {
      throw new Error(
        "Invalid data: 'shifts' field is missing or not an array"
      );
    }
    // Update each shift - remove employees field and set available to false (because we don't need it)
    data.shifts.forEach((shift) => {
      shift.available = false;
      delete shift.employees;
    });

    return data;
  }

  const fetchExistingSubmission = async (schedule) => {
    try {
      const weekStart = moment()
        .tz("Asia/Jerusalem")
        .add(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      const existingSubmissionResponse = await axios.get(
        `${apiUrl}/api/shiftRequests/employee/${user._id}`,
        {
          params: { weekStart },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const existingSubmissions = existingSubmissionResponse.data;
      const updatedSchedule = {
        ...schedule,
        shifts: schedule.shifts.map((shift) => {
          const submission = existingSubmissions.find(
            (sub) => sub.shiftId === shift._id
          );
          return {
            ...shift,
            available: submission ? submission.available : false,
          };
        }),
      };

      setMySchedule(updatedSchedule);
    } catch (error) {
      console.error("Error fetching existing submission:", error);
      if (error.response && error.response.status === 404) {
        setMySchedule(schedule);
      } else {
        toast.error("Failed to fetch existing shifts. Please try again later.");
      }
    }
  };

  const handleSubmitShifts = async () => {
    if (!user) {
      toast.error("User not authenticated. Please log in and try again.");
      return;
    }

    try {
      const weekStart = moment
        .tz(mySchedule.weekStartDate, "Asia/Jerusalem")
        .startOf("week")
        .format("YYYY-MM-DD");

      const submissions = mySchedule.shifts.map((shift) => ({
        shiftId: shift._id,
        available: shift.available,
        day: getDayName(shift.date),
      }));
      const requestBody = {
        userId: user._id,
        requestedShifts: submissions,
        weekStart: weekStart,
      };

      const response = await axios.post(
        `${apiUrl}/api/shiftRequests/submit`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Shifts submitted successfully!");
      // Refetch the existing submissions after successful submission
      await fetchExistingSubmission(mySchedule);
    } catch (error) {
      console.error("Error submitting shifts:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        `Failed to submit shifts: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const getDayName = (dateString) => {
    const date = moment.tz(dateString, "Asia/Jerusalem");
    return date.format("dddd"); // Returns the full name of the day
  };

  const handleClearShifts = () => {
    const clearedState = {
      ...mySchedule,
      shifts: mySchedule.shifts.map((shift) => ({
        ...shift,
        available: false,
      })),
    };
    setMySchedule(clearedState);
  };

  const canSubmitShifts =
    submissionState.isOpen &&
    (!submissionState.cutoffDateTime ||
      new Date() < new Date(submissionState.cutoffDateTime));

  if (!user || !token) {
    return <Typography>Please log in to view this page.</Typography>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{`Error: ${error.message}`}</Alert>;
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ p: 3 }}
    >
      <Grid item xs={12} md={10} lg={8}>
        {canSubmitShifts ? (
          <>
            <Typography variant="h4" gutterBottom>
              Click on a cell to toggle availability for that shift.
            </Typography>
            <ScheduleTable
              mySchedule={mySchedule}
              setMySchedule={setMySchedule}
            />
            <Tooltip title="Clear">
              <Fab
                aria-label="delete"
                style={{ ...buttonStyles, right: 110 }}
                onClick={handleClearShifts}
              >
                <ClearIcon sx={{ color: blue[700] }} />
              </Fab>
            </Tooltip>
            <Tooltip title="Submit">
              <Fab
                style={{ ...buttonStyles, right: 40 }}
                onClick={handleSubmitShifts}
              >
                <SendIcon aria-label="submit" sx={{ color: blue[700] }} />
              </Fab>
            </Tooltip>
          </>
        ) : (
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              mt: 4,
              p: 2,
              border: "2px solid #f44336",
              "& .MuiAlert-message": {
                fontSize: "1.2rem",
              },
            }}
          >
            Shift submission is currently locked
          </Alert>
        )}
      </Grid>
    </Grid>
  );
}

export default EmployeeSubmitShifts;
