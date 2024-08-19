import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AdminDashboard from "../pages/adminPages/AdminDashboard";
import EmployeeLayout from "../layout/EmployeeLayout";
import EmployeeHomePage from "../pages/EmployeePages/EmployeeHomePage";
import EmployeeShifts from "../pages/EmployeePages/EmployeeShifts";
import EmployeeSubmitShifts from "../pages/EmployeePages/EmployeeSubmitShifts";
import ShiftArrangement from "../pages/adminPages/ShiftArrangement";
import Employees from "../pages/adminPages/Employees";
import LoginPage from "../pages/LoginPage";
import SetupPage from "../pages/adminPages/SetupPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="shift-arrangement" element={<ShiftArrangement />} />
        <Route path="setup" element={<SetupPage />} />
      </Route>
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<EmployeeHomePage />} />
        <Route path="submit-shifts" element={<EmployeeSubmitShifts />} />
        <Route path="my-shifts" element={<EmployeeShifts />} />
      </Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
