import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./styles/ScheduleTable.css";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Jerusalem");
moment.updateLocale("en", {
  week: {
    dow: 0, // Sunday is the first day of the week
  },
});

function ScheduleTable({ mySchedule, setMySchedule }) {
  const dates = [...new Set(mySchedule.shifts.map((shift) => shift.date))].sort(
    (a, b) => moment(a).diff(moment(b))
  );
  const shiftTypes = ["Morning", "Evening", "Night"];

  const toggleCell = (shiftId) => {
    const shift = mySchedule.shifts.find((shift) => shift._id === shiftId);
    setMySchedule((prevState) => ({
      ...prevState,
      shifts: prevState.shifts.map((s) =>
        s._id === shiftId ? { ...s, available: !s.available } : s
      ),
    }));
  };

  const getDayName = (dateString) => {
    return moment(dateString).format("dddd");
  };

  const formatDateString = (dateString) => {
    const date = moment(dateString);
    return date.format("DD/MM/YYYY");
  };

  return (
    <div className="schedule-table-container">
      <Table
        className="schedule-table"
        sx={{
          border: "2px solid black",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Shift</TableCell>
            {dates.map((date) => (
              <TableCell key={date}>
                <span className="day-name">{getDayName(date)}</span>
                <span className="date">{formatDateString(date)}</span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {shiftTypes.map((shiftType) => (
            <TableRow key={shiftType}>
              <TableCell>{shiftType}</TableCell>
              {dates.map((date) => {
                const shift = mySchedule.shifts.find(
                  (s) => s.date === date && s.type === shiftType
                );
                const cellKey = `${shift._id}`;
                if (shift.numberOfEmployees === 0) {
                  return (
                    <TableCell
                      style={{ cursor: "not-allowed" }}
                      key={cellKey}
                      sx={{
                        verticalAlign: "top",
                        height: "100%",
                        padding: 8,
                        position: "relative",
                        transition: "all 0.3s ease",
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          #f0f0f0,
                          #f0f0f0 2px,
                          #e8e8e8 2px,
                          #e8e8e8 4px
                        )`,
                        backgroundSize: "6px 6px",
                      }}
                    ></TableCell>
                  );
                }
                return (
                  <TableCell
                    key={cellKey}
                    onClick={() => toggleCell(shift._id)}
                    className={`cell ${
                      mySchedule.shifts.filter(
                        (shift) => shift._id === cellKey
                      )[0].available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {mySchedule.shifts.filter(
                      (shift) => shift._id === cellKey
                    )[0].available
                      ? "Available"
                      : "Unavailable"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ScheduleTable;
