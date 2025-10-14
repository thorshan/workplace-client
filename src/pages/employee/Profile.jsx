import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CardActions,
  Button,
  Avatar,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import employeeApiClient from "../../api/employeeApiClient";
import { empLeaveApi } from "../../api/empLeaveApi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem("empEmail");
      if (!email) {
        navigate("/workplace/login");
        return;
      }
      const res = await employeeApiClient.post("/profile", { email });
      setProfile(res.data);
      const empLeave = await empLeaveApi.getLeavesByEmployee(res.data._id);
      setLeaves(empLeave);
    } catch (error) {
      console.error("Error fetching employee profile:", error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("empEmail");
    localStorage.removeItem("empToken");
    navigate("/workplace/login");
    setProfile(null);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (!profile) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Avatar alt="User" src={null} sx={{ width: 108, height: 108 }}>
        {profile.name[0].toUpperCase()}
      </Avatar>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>
            <strong>Employee ID:</strong> {profile.employeeID || "N/A"}
          </Typography>
          <Typography>
            <strong>Department:</strong>{" "}
            {profile.department ? profile.department.name : "N/A"}
          </Typography>
          <Typography>
            <strong>Joined Date:</strong>{" "}
            {profile.employmentDate
              ? new Date(profile.employmentDate).toLocaleDateString()
              : "N/A"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </CardActions>
      </Card>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Leave History
      </Typography>
      <Paper>
        {leaves && leaves.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No leave requests yet.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
