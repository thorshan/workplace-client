import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/protected/ProtectedRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

// HR Section
import HrDashboard from "../pages/hr/Dashboard";
import Users from "../pages/user/Users";
import Employee from "../pages/hr/Employee";
import Attendance from "../pages/hr/Attendance";
import Review from "../pages/hr/Review";
import Leaves from "../pages/hr/Leaves";

// Finance Section
import FinanceDashboard from "../pages/finance/Dashboard";
import Payroll from "../pages/finance/Payroll";
import Expense from "../pages/finance/Expense";
import Report from "../pages/finance/Report";
import Invoices from "../pages/finance/Invoices";

// Sales Section
import SalesDashbaord from "../pages/sales/Dashboard";
import Leads from "../pages/sales/Leads";
import Campaigns from "../pages/sales/Campaigns";
import Clients from "../pages/sales/Clients";

import Forbidden from "../pages/error/Forbidden";
import NotFound from "../pages/error/NotFound";
import { ROLES } from "../utils/constants";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />

    {/* Protected Dashboard Layout */}
    <Route
      element={
        <ProtectedRoute
          roles={[ROLES.ADMIN, ROLES.HR, ROLES.FINANCE, ROLES.SALES]}
        >
          <Dashboard />
        </ProtectedRoute>
      }
    >
      {/* Default Dashboard Home */}
      <Route index element={<h2>Welcome to Dashboard</h2>} />

      {/* Users (Admin only) */}
      <Route
        path="users"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* HR Department */}
      <Route
        path="hr"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.HR]}>
            <HrDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="hr/manage"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.HR]}>
            <Employee />
          </ProtectedRoute>
        }
      />
      <Route
        path="hr/attendance"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.HR]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="hr/review"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.HR]}>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="hr/l&h"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.HR]}>
            <Leaves />
          </ProtectedRoute>
        }
      />

      {/* Finance Department */}
      <Route
        path="finance"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <FinanceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="finance/payroll"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Payroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="finance/expense"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Expense />
          </ProtectedRoute>
        }
      />
      <Route
        path="finance/report"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route
        path="finance/invoices"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.FINANCE]}>
            <Invoices />
          </ProtectedRoute>
        }
      />

      {/* Sales & Marketing */}
      <Route
        path="sales"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SALES]}>
            <SalesDashbaord />
          </ProtectedRoute>
        }
      />
      <Route
        path="sales/leads"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SALES]}>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="sales/campaigns"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SALES]}>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="sales/clients"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SALES]}>
            <Clients />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Error Routes */}
    <Route path="/forbidden" element={<Forbidden />} />
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
