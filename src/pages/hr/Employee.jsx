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
import { employeeApi } from "../../api/employeeApi";
import apiClient from "../../api/apiClient";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phNumber: "",
    department: "",
    employeeID: "",
    employmentDate: "",
    dateOfBirth: "",
    idNumber: "",
    address: "",
  });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Generate unique EmployeeID per department
  const generateEmployeeID = (deptId) => {
    if (!deptId || employees.length === 0) return "001"; // fallback

    // Filter employees in the same department
    const deptEmployees = employees.filter(
      (e) => e.department?._id === deptId || e.department === deptId
    );

    // Extract numeric part from existing EmployeeIDs
    const numbers = deptEmployees
      .map((e) => {
        const match = e.employeeID?.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .sort((a, b) => b - a); // descending

    const nextNumber = numbers.length > 0 ? numbers[0] + 1 : 1;
    const prefix =
      departments
        .find((d) => d._id === deptId)
        ?.name.slice(0, 2)
        .toUpperCase() || "XX";

    return `${prefix}${nextNumber.toString().padStart(4, "0")}`; // e.g., HR0001, FI0002
  };

  // Open Add/Edit modal
  const openFormModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        ...employee,
        // If employee.department is an object, get its _id; otherwise use empty string
        department: employee.department?._id || employee.department || "",
      });
    } else if (departments.length) {
      const defaultDept = departments[0];
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        phNumber: "",
        department: defaultDept._id,
        employeeID: generateEmployeeID(defaultDept._id),
        employmentDate: "",
        dateOfBirth: "",
        idNumber: "",
        address: "",
      });
    }
    setShowFormModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEmployee) {
      await employeeApi.updateEmployee(editingEmployee._id, formData);
    } else {
      await employeeApi.createEmployee(formData);
    }
    setShowFormModal(false);
    fetchEmployees();
  };

  // Open Delete Modal
  const openDeleteModal = (id) => {
    setDeleteEmployeeId(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (deleteEmployeeId) {
      await employeeApi.deleteEmployee(deleteEmployeeId);
      setShowDeleteModal(false);
      setDeleteEmployeeId(null);
      fetchEmployees();
    }
  };

  // Department change updates employeeID
  const handleDepartmentChange = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      department: deptId,
      employeeID: generateEmployeeID(deptId),
    }));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Employees
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => openFormModal()}
      >
        Add Employee
      </Button>

      {/* Employee Form Modal */}
      {showFormModal && (
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
              width: 700,
              maxHeight: "90vh",
              overflowY: "auto",
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editingEmployee
                ? `Edit Employee: ${editingEmployee.name}`
                : "Add Employee"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <TextField
                label="Phone"
                value={formData.phNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phNumber: e.target.value })
                }
              />
              <TextField
                select
                label="Department"
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Employee ID"
                value={formData.employeeID}
                disabled
              />
              <TextField
                label="Employment Date"
                type="date"
                value={formData.employmentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employmentDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                fullWidth
              />
              {/* Buttons */}
              <Box
                sx={{
                  gridColumn: "span 2",
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editingEmployee ? "Update" : "Add"}
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

      {/* Employees Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Employee ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp._id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.employeeID}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phNumber}</TableCell>
              <TableCell>
                {emp.department?.name ||
                  departments.find((d) => d._id === emp.department)?.name}
              </TableCell>
              <TableCell>{emp.address}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => openFormModal(emp)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(emp._id)}
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

export default Employee;
