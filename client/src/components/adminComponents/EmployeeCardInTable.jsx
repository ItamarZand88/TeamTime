import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CardContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function EmployeeCardInTable({
  id,
  name,
  role,
  isDragging,
  onDeleteEmployeeFromShift,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name,
      role,
    },
  });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    width: "100%",
    height: "auto",
    marginBottom: "5px",
    backgroundColor: "#cce5ff",
    borderRadius: "8px",
    border: "1px solid #b6c4db",
    transition: "opacity 0.2s, box-shadow 0.2s",
    boxShadow: isDragging ? "0 5px 10px rgba(0,0,0,0.1)" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  };

  const textStyle = {
    flexGrow: 1,
    marginLeft: "2px",
  };

  const closeIconStyle = {
    position: "absolute",
    right: "8px",
  };

  // Function to handle deletion and stop propagation
  const handleDelete = (event) => {
    event.stopPropagation();
    onDeleteEmployeeFromShift(id);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CardContent style={textStyle} {...attributes} {...listeners}>
        <Typography variant="body2" component="div">
          {name}
        </Typography>
      </CardContent>
      <IconButton size="small" onClick={handleDelete} style={closeIconStyle}>
        <CloseIcon style={{ fontSize: "16px" }} />
      </IconButton>
    </div>
  );
}

export default EmployeeCardInTable;
