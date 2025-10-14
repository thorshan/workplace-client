import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { empLeaveApi } from "../../api/empLeaveApi";
import employeeApiClient from "../../api/employeeApiClient";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    employee: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState(null);

  const leaveTypes = ["Annual", "Sick", "Casual", "Vacation", "Other"];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const email = localStorage.getItem("empEmail");
        if (!email) {
          setError("Faild to get data");
          return;
        }
        const resEmp = await employeeApiClient.post("/profile", { email });
        setEmployee(resEmp.data);
        setFormData((prev) => ({
          ...prev,
          employee: resEmp.data._id || resEmp.data.name || email,
        }));
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch employee data"
        );
      }
    };
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...formData,
        employee: employee._id || employee?.name || "",
      };
      const res = await empLeaveApi.createLeave(payload);
      if (res.status === 201) {
        setMessage("Leave request submitted successfully!");
        setFormData({
          ...formData,
          type: "",
          startDate: "",
          endDate: "",
          reason: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit leave request");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Leave Request
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Employee"
              name="employee"
              InputLabelProps={{ shrink: true }}
              value={employee?.name || ""}
              required
              disabled
            />

            <TextField
              select
              label="Leave Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <TextField
              label="End Date"
              type="date"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleChange}
              required
            />

            <TextField
              label="Reason"
              name="reason"
              multiline
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              required
            />

            <Button variant="contained" color="primary" type="submit">
              Submit Request
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LeaveRequest;
