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

  const fetchSheet = () => {
    try {
      const res = apiClient.get(`/attendance-sheets/${id}`);
      setSheet(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (recordId, updates) => {
    try {
      await apiClient.put(
        `/attendance-sheets/${id}/record/${recordId}`,
        updates
      );
      fetchSheet();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSheet();
  }, [id]);

  if (!sheet) return <Typography>Loading ...</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">
          Attendance for {new Date(sheet.date).toLocaleDateString()}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/attendance-sheets")}
        >
          Back
        </Button>
      </Box>

      {/* Table */}
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
          {sheet.records.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.employee?.name}</TableCell>
              <TableCell>{record.department?.name}</TableCell>
              <TableCell>
                <Select
                  value={record.status}
                  onChange={(e) =>
                    handleUpdate(record._id, { status: e.target.value })
                  }
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  value={record.status}
                  onChange={(e) =>
                    handleUpdate(record._id, { remark: e.target.value })
                  }
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
