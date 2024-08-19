import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-toastify";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import Brightness7OutlinedIcon from "@mui/icons-material/Brightness7Outlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import moment from "moment-timezone";

const apiUrl = import.meta.env.VITE_API_URL;

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
}));

const ShiftItem = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: "4px",
  backgroundColor: theme.palette.grey[100],
  marginTop: theme.spacing(2),
}));
const iconColor = "#3b82f6";
function EmployeeShifts() {
  const [currentWeekShifts, setCurrentWeekShifts] = useState([]);
  const [nextWeekShifts, setNextWeekShifts] = useState([]);
  const { user, token } = useAuth();
  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  useEffect(() => {
    if (token) {
      fetchShifts(0);
      fetchShifts(1);
    }
  }, [token]);

  const fetchShifts = async (weekOffset) => {
    if (!user || !token) {
      toast.info(
        "You must be logged in and have a valid token to view shifts."
      );
      return;
    }
    try {
      const weekStart = moment()
        .tz("Asia/Jerusalem")
        .add(weekOffset, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");
      const response = await axios.get(
        `${apiUrl}/api/shifts/myShifts`,
        {
          params: { weekStart },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(response.data)) {
        if (weekOffset === 0) {
          setCurrentWeekShifts(response.data);
        } else {
          setNextWeekShifts(response.data);
        }
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Received unexpected data format");
      }
    } catch (error) {
      console.error(
        "Failed to fetch shifts:",
        error.response?.data || error.message
      );
      toast.error("Failed to load shifts!");
    }
  };

  const getShiftIcon = (shiftType) => {
    switch (shiftType) {
      case "Morning":
        return <WbSunnyOutlinedIcon style={{ color: iconColor }} />; // Yellow color for morning
      case "Evening":
        return <Brightness7OutlinedIcon style={{ color: iconColor }} />; // Orange color for evening
      case "Night":
        return <NightsStayOutlinedIcon style={{ color: iconColor }} />; // Indigo color for night
      default:
        return <WbSunnyOutlinedIcon style={{ color: iconColor }} />;
    }
  };

  const renderShiftItem = (shift) => (
    <ShiftItem key={shift._id}>
      {getShiftIcon(shift.type)}
      <div>
        <Typography variant="subtitle1">{shift.type} Shift</Typography>
        <Typography variant="body2" color="textSecondary">
          {moment(shift.startTime).format("h:mm A")} -{" "}
          {moment(shift.endTime).format("h:mm A")}
        </Typography>
      </div>
      <Typography variant="body2" fontWeight="medium">
        {moment(shift.date).format("MMM D")}
      </Typography>
    </ShiftItem>
  );

  const renderWeekShifts = (shifts, title) => (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <Box>
            <WbSunnyOutlinedIcon style={{ color: iconColor, marginRight: 8 }} />
            <Brightness7OutlinedIcon
              style={{ color: iconColor, marginRight: 8 }}
            />
            <NightsStayOutlinedIcon style={{ color: iconColor }} />
          </Box>
        </Box>
        {shifts.length > 0 ? (
          shifts.map(renderShiftItem)
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No shifts scheduled for this week.
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );

  return (
    <animated.div style={fade}>
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {renderWeekShifts(currentWeekShifts, "Current Week")}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderWeekShifts(nextWeekShifts, "Next Week")}
          </Grid>
        </Grid>
      </Box>
    </animated.div>
  );
}

export default EmployeeShifts;
