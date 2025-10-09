import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import employeeApiClient from "../../api/employeeApiClient";

const Home = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem("empEmail");
      if (!email) {
        navigate("/workplace/login");
        return;
      }

      const res = await employeeApiClient.post("/profile", { email });
      setEmployee(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!employee)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">No employee data found.</Typography>
        <Button onClick={() => navigate("/workplace/login")}>
          Go to Login
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome back, {employee.name} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          This is your employee dashboard.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ mb: 2 }}
          onClick={() => navigate("/workplace/leaverequest")}
        >
          Go to Leave Request
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/workplace/profile")}
        >
          View Profile
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
