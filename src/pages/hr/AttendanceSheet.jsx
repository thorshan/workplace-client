import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const AttendanceSheet = () => {
  const [sheets, setSheets] = useState([]);
  const [open, setOpenDialog] = useState(false);
  const [date, setDate] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const navigate = useNavigate();

  // Fetch Sheets
  const fetchSheets = async () => {
    try {
      const res = await apiClient.get("/attendance-sheets");
      setSheets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Sheet
  const handleCreateSheet = async () => {
    try {
      await apiClient.post("/attendance-sheets", { date });
      setOpenDialog(false);
      setDate("");
      fetchSheets();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Confirm Dialog
  const confirmDelete = async (e) => {
    try {
      e.stopPropagation();
      if (!selectedSheetId) return;

      await apiClient.delete(`/attendance-sheets/${selectedSheetId}`);
      setOpenConfirmDialog(false);
      setSelectedSheetId(null);
      fetchSheets();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Attendance Sheets</Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add Sheet
        </Button>
      </Box>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sheets.map((sheet) => (
            <TableRow
              key={sheet._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/hr/attendance-sheets/${sheet._id}`)}
            >
              <TableCell>{new Date(sheet.date).toLocaleDateString()}</TableCell>
              <TableCell>{sheet.createdBy?.name || "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSheetId(sheet._id); 
                    setOpenConfirmDialog(true);
                  }}
                  size="small"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>
          <Typography variant="h6">Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this sheet?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Sheet Dialog */}
      <Dialog open={open} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Attendance Sheet</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            fullWidth
            margin="dense"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateSheet} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceSheet;
