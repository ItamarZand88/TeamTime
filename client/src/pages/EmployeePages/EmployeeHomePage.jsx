import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";

const apiUrl = import.meta.env.VITE_API_URL;

function EmployeeHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const { user } = useAuth();

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    let greeting = "";
    if (currentHour >= 5 && currentHour < 12) greeting = "Good Morning";
    else if (currentHour >= 12 && currentHour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    // Add the user's name to the greeting if available
    return user?.name ? `${greeting}, ${user.name}` : greeting;
  };
  const generateColor = (index) => {
    const colors = [
      "#EEE6FF", // Light Purple
      "#e6ffff", // Light Blue
      // "#e6ffe6", // Light Green
      "#ffeaea", // Light Red
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/notes`);
        if (!response.status === 200) {
          throw new Error("Failed to fetch notes");
        }

        setNotes(response.data); // Assuming response.data contains the notes data
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();

    return () => clearInterval(interval);
  }, []);

  return (
    <animated.div style={fade}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
        style={{
          height: "100vh",
          padding: "10px",
          backgroundColor: "#EEF2F6",
          backgroundImage: "radial-gradient(#91969C 0.1px, transparent 1px)", // Dots
          backgroundSize: "20.35px 20.35px",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Greeting and Date */}
        <Grid item xs={12} md={6} lg={3}>
          <Box sx={{ mb: 3, mt: 2, mr: 2 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "bold",
              }}
            >
              {getGreeting()}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              sx={{ fontSize: "0.8rem" }}
            >
              {currentTime.toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
        {/*Week Schedule */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 4,
              mr: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              border: "2px solid #000",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Week Schedule :
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 1,
                mt: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                width: "80%",
              }}
            >
              {schedule.length > 0 ? (
                <Box>
                  {schedule.map((shift, index) => (
                    <Typography key={index} variant="body1">
                      {shift.day}: {shift.start} - {shift.end}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" sx={{ fontSize: "0.75rem" }}>
                  No shifts scheduled
                </Typography>
              )}
            </Paper>
          </Paper>
        </Grid>

        {/* Notes  */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 4,
              mr: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              border: "2px solid #000",
            }}
          >
            {notes.length > 0 ? (
              <Typography
                sx={{ mb: 3, fontFamily: "'Roboto', sans-serif" }}
                variant="h5"
                gutterBottom
              >
                Important Notes:
              </Typography>
            ) : (
              ""
            )}
            {notes.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {notes.map((note, index) => (
                  <Paper
                    key={note._id}
                    elevation={1}
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1,
                      backgroundColor: generateColor(index),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1">{note.content}</Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              ""
            )}
          </Paper>
        </Grid>
      </Grid>
    </animated.div>
  );
}

export default EmployeeHomePage;
