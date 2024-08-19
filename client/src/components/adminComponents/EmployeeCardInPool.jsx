import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CardContent, Typography } from "@mui/material";

function EmployeeCardInPool({ id, children, role, draggedItem }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const bgColor = "#cce5ff"; // Default color if role not found
  const isDragging = id === draggedItem;

  const style = {
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    width: "100%", // Ensure consistent width
    height: "auto", // Maintain aspect ratio
    marginBottom: "5px",
    backgroundColor: "#cce5ff",
    borderRadius: "8px",
    border: "1px solid #b6c4db",
    transition: "opacity 0.2s, box-shadow 0.2s",
    boxShadow: isDragging ? "0 5px 10px rgba(0,0,0,0.1)" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardContent style={{ padding: "8px" }}>
        <Typography variant="body2" style={{ textAlign: "center" }}>
          {children}
        </Typography>
      </CardContent>
    </div>
  );
}

export default EmployeeCardInPool;
