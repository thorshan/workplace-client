import React, { useState } from "react";
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

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const leaveTypes = ["Annual", "Sick", "Casual", "Vacation", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await empLeaveApi.post("/leaves/create", formData);
      if (res.status === 201) {
        setMessage("Leave request submitted successfully!");
        setFormData({
          leaveType: "",
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
              select
              label="Leave Type"
              name="leaveType"
              value={formData.leaveType}
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
