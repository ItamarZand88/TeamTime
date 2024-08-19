import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { gridSpacing } from "../../store/constant";
import LockSubmitShifts from "../../components/adminComponents/LockSubmitShifts";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const apiUrl = import.meta.env.VITE_API_URL;


const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [openAddNoteModal, setOpenAddNoteModal] = useState(false);
  const [cutoffDateTime, setCutoffDateTime] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toISOString()
  );
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
    fetchNotes();
    fetchSubmissionState();
  }, []);

  const fetchSubmissionState = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/submissionState`);
      if (!response.ok) {
        throw new Error("Failed to fetch submission state");
      }
      const data = await response.json();
      setIsSubmissionOpen(data.isOpen);
      if (data.cutoffDateTime) {
        setCutoffDateTime(data.cutoffDateTime);
      }
    } catch (error) {
      console.error("Error fetching submission state:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/notes`);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const response = await fetch(`${apiUrl}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newNote }),
      });
      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      setNewNote("");
      setOpenAddNoteModal(false);
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSetCutoffDateTime = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/submissionState`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isOpen: isSubmissionOpen,
            cutoffDateTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update submission state");
      }

      const data = await response.json();
      setIsSubmissionOpen(data.isOpen);
      setCutoffDateTime(data.cutoffDateTime);
    } catch (error) {
      console.error("Error updating submission state:", error);
    }
  };

  const handleToggleClose = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/submissionState"`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isOpen: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update submission state");
      }

      const data = await response.json();
      setIsSubmissionOpen(data.isOpen);
    } catch (error) {
      console.error("Error updating submission state:", error);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={4}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mt: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            border: "2px solid #000",
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" gutterBottom>
                Edit Notes:
              </Typography>
            </Grid>
            <Grid item style={{ textAlign: "right" }}>
              <IconButton
                color="primary"
                onClick={() => setOpenAddNoteModal(true)}
              >
                <Add />
              </IconButton>
            </Grid>
          </Grid>
          <Box>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Paper
                  key={note._id}
                  elevation={1}
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{note.content}</Typography>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    <Delete />
                  </IconButton>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" sx={{ fontSize: "0.75rem" }}>
                Click on the + button to add a note
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>

      <Modal
        open={openAddNoteModal}
        onClose={() => setOpenAddNoteModal(false)}
        aria-labelledby="add-note-modal-title"
        aria-describedby="add-note-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddNoteModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <Typography id="add-note-modal-title" variant="h6" gutterBottom>
              Add Note
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your note here"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ textAlign: "right" }}>
              <Button
                onClick={() => setOpenAddNoteModal(false)}
                color="primary"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNote} color="primary">
                Add Note
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Grid item xs={3}>
        <LockSubmitShifts
          isSubmissionOpen={isSubmissionOpen}
          setIsSubmissionOpen={setIsSubmissionOpen}
          cutoffDateTime={cutoffDateTime}
          setCutoffDateTime={setCutoffDateTime}
          handleSetCutoffDateTime={handleSetCutoffDateTime}
          handleToggleClose={handleToggleClose}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
