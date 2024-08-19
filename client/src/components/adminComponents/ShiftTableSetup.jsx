import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Fab,
  Alert,
  Checkbox,
} from "@mui/material";
import { Edit as EditIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { blue } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";

const ShiftSetupTable = ({
  shifts: initialShifts,
  onShiftsChange,
  handleSubmit,
}) => {
  const [shifts, setShifts] = useState(initialShifts);
  const [openModal, setOpenModal] = useState(false);
  const [currentShift, setCurrentShift] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openBulkEditModal, setOpenBulkEditModal] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [bulkEditDetails, setBulkEditDetails] = useState({});
  const [templates, setTemplates] = useState([]);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shiftTypes = ["Morning", "Evening", "Night"];

  const handleOpenModal = (shift = {}) => {
    setCurrentShift(shift);
    setIsEditing(!!shift.shiftDetail);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentShift({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentShift((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveShift = () => {
    const updatedShifts = isEditing
      ? shifts.map((shift) =>
          shift.shiftDetail === currentShift.shiftDetail &&
          shift.day === currentShift.day
            ? currentShift
            : shift
        )
      : [...shifts, currentShift];

    setShifts(updatedShifts);
    onShiftsChange(updatedShifts);
    handleCloseModal();
    showSnackbar(
      `Shift ${isEditing ? "updated" : "added"} successfully`,
      "success"
    );
  };

  const handleDeleteShift = (shiftDetail, day) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      const updatedShifts = shifts.filter(
        (shift) => !(shift.shiftDetail === shiftDetail && shift.day === day)
      );
      setShifts(updatedShifts);
      onShiftsChange(updatedShifts);
      showSnackbar("Shift deleted successfully", "success");
    }
  };

  const handleCopyShift = (shift) => {
    const newShift = { ...shift, shiftDetail: `${shift.shiftDetail} (Copy)` };
    handleOpenModal(newShift);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleBulkEditMode = () => {
    setBulkEditMode(!bulkEditMode);
    setSelectedShifts([]);
  };

  const handleShiftSelection = (shiftId) => {
    setSelectedShifts((prev) =>
      prev.includes(shiftId)
        ? prev.filter((id) => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  const handleBulkEditChange = (e) => {
    const { name, value } = e.target;
    setBulkEditDetails((prev) => ({ ...prev, [name]: value }));
  };

  const applyBulkEdit = () => {
    const updatedShifts = shifts.map((shift) => {
      if (selectedShifts.includes(`${shift.shiftDetail}-${shift.day}`)) {
        return { ...shift, ...bulkEditDetails };
      }
      return shift;
    });
    setShifts(updatedShifts);
    onShiftsChange(updatedShifts);
    setBulkEditMode(false);
    setSelectedShifts([]);
    setBulkEditDetails({});
    setOpenBulkEditModal(false);
    showSnackbar("Bulk edit applied successfully", "success");
  };

  const handleSaveTemplate = () => {
    if (!templateName) {
      showSnackbar("Please enter a template name", "error");
      return;
    }
    setTemplates([...templates, { name: templateName, shifts: shifts }]);
    setOpenTemplateModal(false);
    setTemplateName("");
    showSnackbar("Template saved successfully", "success");
  };

  const handleLoadTemplate = (templateName) => {
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      setShifts(template.shifts);
      onShiftsChange(template.shifts);
      showSnackbar("Template loaded successfully", "success");
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Tooltip
            title={bulkEditMode ? "Exit Bulk Edit" : "Enter Bulk Edit Mode"}
            placement="top"
          >
            <Fab
              variant="contained"
              color="secondary"
              onClick={toggleBulkEditMode}
              style={{
                backgroundColor: "#1976d214",
                marginBottom: "10px",
                marginLeft: "10px",
                border: "0.5px solid #000",
                color: "#000",
                borderRadius: "8px",
              }}
            >
              <EditIcon sx={{ color: blue[700] }} />
            </Fab>
          </Tooltip>
          <Tooltip title="Save as Template" placement="top">
            <Fab
              variant="contained"
              color="info"
              onClick={() => setOpenTemplateModal(true)}
              style={{
                backgroundColor: "#1976d214",
                marginBottom: "10px",
                marginLeft: "10px",
                border: "0.5px solid #000",
                color: "#000",
                borderRadius: "8px",
              }}
            >
              <SaveAsIcon sx={{ color: blue[700] }} />
            </Fab>
          </Tooltip>
          <Tooltip title="Send" placement="top">
            <Fab
              type="submit"
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#1976d214",
                marginBottom: "10px",
                marginLeft: "10px",
                border: "0.5px solid #000",
                color: "#000",
                borderRadius: "8px",
              }}
            >
              <SendIcon sx={{ color: blue[700] }} />
            </Fab>
          </Tooltip>
        </Box>
        <Select
          value=""
          onChange={(e) => handleLoadTemplate(e.target.value)}
          displayEmpty
          sx={{ marginLeft: "10px" }}
        >
          <MenuItem value="" disabled>
            Load Template
          </MenuItem>
          {templates.map((template, index) => (
            <MenuItem key={index} value={template.name}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TableContainer component={Paper} sx={{ border: "2px solid black" }}>
        <Table>
          <TableHead>
            <TableRow>
              {bulkEditMode && <TableCell padding="checkbox">Select</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Number of Employees
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={`${shift.shiftDetail}-${shift.day}`}>
                {bulkEditMode && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedShifts.includes(
                        `${shift.shiftDetail}-${shift.day}`
                      )}
                      onChange={() =>
                        handleShiftSelection(
                          `${shift.shiftDetail}-${shift.day}`
                        )
                      }
                    />
                  </TableCell>
                )}
                <TableCell>{shift.shiftDetail}</TableCell>
                <TableCell>{shift.day}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>{shift.numberOfEmployees}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenModal(shift)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <IconButton onClick={() => handleCopyShift(shift)}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
      ></Box>

      {bulkEditMode && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenBulkEditModal(true)}
          sx={{ mt: 2 }}
        >
          Edit Selected Shifts
        </Button>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {isEditing ? "Edit Shift" : "Add New Shift"}
          </Typography>
          <Select
            fullWidth
            margin="normal"
            label="Shift Detail"
            name="shiftDetail"
            value={currentShift.shiftDetail || ""}
            onChange={handleInputChange}
          >
            {shiftTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            margin="normal"
            label="Day"
            name="day"
            value={currentShift.day || ""}
            onChange={handleInputChange}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Start Time"
            name="startTime"
            type="time"
            value={currentShift.startTime || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Time"
            name="endTime"
            type="time"
            value={currentShift.endTime || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Number of Employees"
            name="numberOfEmployees"
            type="number"
            value={currentShift.numberOfEmployees || ""}
            onChange={handleInputChange}
          />
          <Button
            onClick={handleSaveShift}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            {isEditing ? "Update" : "Add"} Shift
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openBulkEditModal}
        onClose={() => setOpenBulkEditModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Bulk Edit Shifts
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Start Time"
            name="startTime"
            type="time"
            value={bulkEditDetails.startTime || ""}
            onChange={handleBulkEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Time"
            name="endTime"
            type="time"
            value={bulkEditDetails.endTime || ""}
            onChange={handleBulkEditChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Number of Employees"
            name="numberOfEmployees"
            type="number"
            value={bulkEditDetails.numberOfEmployees || ""}
            onChange={handleBulkEditChange}
          />
          <Button
            onClick={applyBulkEdit}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Apply Bulk Edit
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Save as Template
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <Button
            onClick={handleSaveTemplate}
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Save Template
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShiftSetupTable;
