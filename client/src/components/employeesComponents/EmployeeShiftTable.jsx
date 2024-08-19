import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthProvider";
import moment from "moment-timezone";
function EmployeeShiftTable({ weekOffset = 0 }) {
  const [shiftData, setShiftData] = useState([]);
  const { user, token } = useAuth();
  const [weekStart, setWeekStart] = useState(
    moment()
      .tz("Asia/Jerusalem")
      .startOf("week")
      .add(weekOffset, "weeks")
      .format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (token) {
      fetchShifts();
    }
  }, [token, weekStart]);

  const fetchShifts = async () => {
    if (!user || !token) {
      toast.info(
        "You must be logged in and have a valid token to view shifts."
      );
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(
        `${apiUrl}/api/shifts/myShifts`,
        {
          params: { weekStart },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(response.data)) {
        setShiftData(response.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TableContainer component={Paper} sx={{ border: "2px solid black" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Shift Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shiftData.map((shift, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(shift.date)}</TableCell>
              <TableCell>{shift.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmployeeShiftTable;
