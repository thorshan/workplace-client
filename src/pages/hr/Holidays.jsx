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
  CircularProgress,
} from "@mui/material";
import { holidayApi } from "../../api/holidayApi";

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);

  // New holiday modal
  const [openModal, setOpenModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchHolidays = async () => {
    try {
      const res = await holidayApi.getHolidays();
      setHolidays(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedHolidayId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await holidayApi.deleteHoliday(selectedHolidayId);
      setHolidays((prev) => prev.filter((h) => h._id !== selectedHolidayId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedHolidayId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedHolidayId(null);
  };

  const handleCreateHoliday = async () => {
    setSubmitting(true);
    try {
      const res = await holidayApi.createHoliday(newHoliday);
      setHolidays((prev) => [...prev, res.data]);
      setOpenModal(false);
      setNewHoliday({ name: "", date: "", description: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Holiday Management
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenModal(true)}
      >
        + New Holiday
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday._id}>
                <TableCell>{holiday.name}</TableCell>
                <TableCell>
                  {new Date(holiday.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{holiday.description}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(holiday._id)}
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
        <DialogTitle>Delete Holiday</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this holiday? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Holiday Modal */}
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
            New Holiday
          </Typography>
          <TextField
            label="Holiday Name"
            fullWidth
            sx={{ mb: 2 }}
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, name: e.target.value })
            }
          />
          <TextField
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, date: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={newHoliday.description}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, description: e.target.value })
            }
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateHoliday}
            disabled={submitting || !newHoliday.name || !newHoliday.date}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Holidays;
