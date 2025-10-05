import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import apiClient from "../../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";

const AttendanceSheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);
  const [editedRecords, setEditedRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSheet = async () => {
    try {
      const res = await apiClient.get(`/attendance-sheets/${id}`);
      setSheet(res.data);
      // initialize editedRecords with only the fields we edit
      setEditedRecords(
        res.data.records.map((r) => ({
          _id: r._id,
          status: r.status ?? "Pending",
          remark: r.remark ?? "",
          // keep employee/department for display if needed:
          employee: r.employee,
          department: r.department,
        }))
      );
    } catch (error) {
      console.error("Fetch sheet error:", error);
    }
  };

  useEffect(() => {
    fetchSheet();
    // eslint-disable-next-line
  }, [id]);

  const handleLocalChange = (recordId, field, value) => {
    setEditedRecords((prev) =>
      prev.map((rec) => (rec._id === recordId ? { ...rec, [field]: value } : rec))
    );
  };

  const handleSubmitAllChanges = async () => {
    setIsSubmitting(true);
    try {
      // send only relevant fields to backend
      const payload = editedRecords.map(({ _id, status, remark }) => ({
        _id,
        status,
        remark,
      }));

      console.log("Submitting payload:", payload);

      const res = await apiClient.put(`/attendance-sheets/${id}`, {
        records: payload,
      });

      console.log("Save response:", res.data);
      // refresh data
      await fetchSheet();
      alert("Attendance updated successfully");
    } catch (err) {
      console.error("Error submitting all changes:", err);
      alert(
        "Failed to save changes. " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sheet) return <Typography>Loading ...</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">
          Attendance for {new Date(sheet.date).toLocaleDateString()}
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmitAllChanges}
            sx={{ mr: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/hr/attendance-sheets")}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Remark</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {editedRecords.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.employee?.name || "—"}</TableCell>
              <TableCell>{record.department?.name || "—"}</TableCell>
              <TableCell>
                <Select
                  value={record.status || "Pending"}
                  onChange={(e) =>
                    handleLocalChange(record._id, "status", e.target.value)
                  }
                  size="small"
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  value={record.remark || ""}
                  onChange={(e) =>
                    handleLocalChange(record._id, "remark", e.target.value)
                  }
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AttendanceSheetDetail;
