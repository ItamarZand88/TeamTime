import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Snackbar,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

const LockSubmitShifts = ({
  isSubmissionOpen,
  setIsSubmissionOpen,
  cutoffDateTime,
  setCutoffDateTime,
  handleSetCutoffDateTime,
  handleToggleClose,
}) => {
  const [formattedCutoffDateTime, setFormattedCutoffDateTime] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (isSubmissionOpen) {
      const date = new Date(cutoffDateTime);
      const formattedDate = date.toISOString().slice(0, 16);
      setFormattedCutoffDateTime(formattedDate);
    } else {
      setFormattedCutoffDateTime("");
    }
  }, [cutoffDateTime]);

  const handleToggleSubmission = () => {
    setIsSubmissionOpen((prevState) => !prevState);
    if (isSubmissionOpen) {
      // If the submission was open and now it is closed - clear the cutoffDateTime
      handleToggleClose();
    }
  };

  const handleSetCutoffDateTimeAndShowSnackbar = async () => {
    try {
      await handleSetCutoffDateTime();
      setSnackbarMessage("Shift submission deadline set successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error setting cutoff date:", error);
      setSnackbarMessage("Failed to set shift submission deadline.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    // Additional actions upon snackbar close if needed
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          border: "2px solid #000",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Set Shift Submission Deadline
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isSubmissionOpen}
                onChange={handleToggleSubmission}
                color="primary"
              />
            }
            label={
              isSubmissionOpen ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton color="success" size="small">
                    <LockOpenIcon />
                  </IconButton>
                  Open
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton color="error" size="small">
                    <LockIcon />
                  </IconButton>
                  Closed
                </Box>
              )
            }
          />
        </Box>
        {isSubmissionOpen && (
          <>
            <Typography variant="h5" gutterBottom>
              Set Deadline for Shift Submission
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={formattedCutoffDateTime}
              onChange={(e) => {
                setCutoffDateTime(e.target.value);
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ textAlign: "right" }}>
              <Button
                onClick={handleSetCutoffDateTimeAndShowSnackbar}
                color="primary"
              >
                Set
              </Button>
            </Box>
          </>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </Grid>
  );
};

export default LockSubmitShifts;
