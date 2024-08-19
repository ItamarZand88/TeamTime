import React from "react";
import {
  Grid,
  CardContent,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
} from "@mui/material";
import EmployeeCardInPool from "./EmployeeCardInPool";
import MainCard from "../../ui-component/cards/MainCard";

function EmployeePool({ filteredEmployees, setSelectedRole, selectedRole }) {
  return (
    <Grid item xs={12} sx={{ maxWidth: 200, margin: "auto" }}>
      <MainCard sx={{ width: "100%" }}>
        <CardContent sx={{ width: "100%" }}>
          <Box sx={{ width: "100%", marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={selectedRole}
                label="Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {["Chef", "Manager", "Waiter", "All"].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <div
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {filteredEmployees.map((employee) => (
              <EmployeeCardInPool
                key={employee._id}
                id={`pool-${employee._id}`}
                role={employee.position}
              >
                {employee.name}
              </EmployeeCardInPool>
            ))}
          </div>
        </CardContent>
      </MainCard>
    </Grid>
  );
}

export default EmployeePool;
