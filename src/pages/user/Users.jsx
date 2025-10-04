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
  TextField,
  MenuItem,
  Paper,
} from "@mui/material";
import { userApi } from "../../api/userApi";
import { ROLES } from "../../utils/constants";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.HR,
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setFormData({ name: "", email: "", password: "", role: ROLES.HR });
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: "" });
    setEditingUser(user);
    setShowModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (deleteUserId) {
      await userApi.deleteEmployee(deleteUserId);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      fetchUsers();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await userApi.updateUser(editingUser._id, formData);
    } else {
      await userApi.createUser(formData);
    }
    setShowModal(false);
    fetchUsers();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleAdd}
      >
        Add User
      </Button>

      {/* Animated Modal */}
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editingUser ? `Edit User: ${editingUser.name}` : "Add User"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                margin="normal"
                required={!editingUser}
              />
              <TextField
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                margin="normal"
              >
                {Object.values(ROLES).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editingUser ? "Update" : "Add"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Confirm Delete
            </Typography>
            <Typography mb={3}>
              Are you sure you want to delete this employee?
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u._id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(u._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default Users;
