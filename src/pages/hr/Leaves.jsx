import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { leaveApi } from "../../api/leaveApi";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  // New Leave Modal
  const [openModal, setOpenModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employee: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveApi.getLeaves();
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Approve / Reject leave
  const handleStatusUpdate = async (id, status) => {
    try {
      await leaveApi.updateLeaveStatus(id, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete leave
  const handleDeleteClick = (id) => {
    setSelectedLeaveId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await leaveApi.deleteLeave(selectedLeaveId);
      fetchLeaves();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedLeaveId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedLeaveId(null);
  };

  // Create new leave (optional)
  const handleCreateLeave = async () => {
    setSubmitting(true);
    try {
      await leaveApi.createLeave(newLeave);
      setOpenModal(false);
      setNewLeave({
        employee: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Leave Management
      </Typography>

      {/* New Leave Button */}
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenModal(true)}
      >
        + New Leave
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave._id}>
                <TableCell>{leave.employee.name}</TableCell>
                <TableCell>{leave.type}</TableCell>
                <TableCell>
                  {new Date(leave.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(leave.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      leave.status === "Approved"
                        ? "green"
                        : leave.status === "Rejected"
                        ? "red"
                        : "orange",
                  }}
                >
                  {leave.status}
                </TableCell>
                <TableCell>
                  {leave.status === "Pending" && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleStatusUpdate(leave._id, "Approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          handleStatusUpdate(leave._id, "Rejected")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 1 }}
                    onClick={() => handleDeleteClick(leave._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Leave</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this leave request? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Leave Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            width: 400,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            New Leave Request
          </Typography>
          <TextField
            label="Employee ID"
            fullWidth
            sx={{ mb: 2 }}
            value={newLeave.employee}
            onChange={(e) =>
              setNewLeave({ ...newLeave, employee: e.target.value })
            }
          />
          <Select
            fullWidth
            sx={{ mb: 2 }}
            value={newLeave.type}
            onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
          >
            <MenuItem value="Sick">Sick</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Annual">Annual</MenuItem>
            <MenuItem value="Vacation">Vacation</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newLeave.startDate}
            onChange={(e) =>
              setNewLeave({ ...newLeave, startDate: e.target.value })
            }
          />
          <TextField
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newLeave.endDate}
            onChange={(e) =>
              setNewLeave({ ...newLeave, endDate: e.target.value })
            }
          />
          <TextField
            label="Reason"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={newLeave.reason}
            onChange={(e) =>
              setNewLeave({ ...newLeave, reason: e.target.value })
            }
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateLeave}
            disabled={
              submitting ||
              !newLeave.employee ||
              !newLeave.type ||
              !newLeave.startDate ||
              !newLeave.endDate
            }
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Leaves;
