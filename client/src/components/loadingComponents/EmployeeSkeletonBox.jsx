import React from "react";
import { Box, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const SkeletonItem = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 28 }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Skeleton variant="rounded" width="100%" height={28} animation="wave" />
  </motion.div>
);

const EmployeeSkeletonBox = () => {
  const count = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <AnimatePresence>
        {[...Array(count)].map((_, index) => (
          <SkeletonItem key={index} delay={index * 0.1} />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default EmployeeSkeletonBox;
