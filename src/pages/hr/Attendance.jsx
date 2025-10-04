import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  OutlinedInput,
  TextField,
  ListItemText,
  Button,
} from "@mui/material";

import apiClient from "../../api/apiClient";
import { attendanceApi } from "../../api/attendanceApi";

const Attendance = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [formData, setFormData] = useState({
    employee: [],
    department: [],
    status: "Pending",
    remark: "",
  });

  // Fetch All Departments
  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch All Employees
  const fetchEmployees = async () => {
    try {
      const res = await apiClient.get("/employee");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch All Attendances
  const fetchAttendance = async () => {
    try {
      const res = await attendanceApi.get("/attendance");
      setAttendances(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
    fetchAttendance();
  }, []);

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Attendance Record Sheet</Typography>
        <Button variant="contained" size="small" color="primary">
          Create New Attendance Sheet
        </Button>
      </Box>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Employee(s)</TableCell>
            <TableCell>Department(s)</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Remark</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendances.map((att) => (
            <TableRow key={att._id}>
              <TableCell>{att.createdAt}</TableCell>
              <TableCell>{att.employee?.name || "N/A"}</TableCell>
              <TableCell>{att.department?.name || "N/A"}</TableCell>
              <TableCell>{att.status}</TableCell>
              <TableCell>{att.createdBy?.name || "N/A"}</TableCell>
              <TableCell>{att.remark}</TableCell>
              <TableCell>
                <Button variant="outlined" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Attendance;
