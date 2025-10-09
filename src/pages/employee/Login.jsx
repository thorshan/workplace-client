import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import employeeApiClient from "../../api/employeeApiClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = token
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Request login token
  const handleSendToken = async () => {
    if (!email) return setMessage("Please enter your email.");
    setLoading(true);
    setMessage("");
    try {
      const res = await employeeApiClient.post("/login", { email });
      setMessage(res.data.token || "Token sent to your email!");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify token
  const handleVerify = async () => {
    if (!token) return setMessage("Please enter the token.");
    setLoading(true);
    setMessage("");
    try {
      const res = await employeeApiClient.post("/verify-token", {
        email,
        token,
      });
      setMessage(res.data.message || "Login successful!");
      localStorage.setItem("empEmail", email);
      localStorage.setItem("empToken", token);
      navigate("/workplace/home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f9f9f9"
    >
      <Paper sx={{ p: 4, width: 400, textAlign: "center" }} elevation={3}>
        <Typography variant="h5" mb={2}>
          Employee Login
        </Typography>

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendToken}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Send Token"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="Enter Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Verify Token"}
            </Button>
          </>
        )}

        {message && (
          <Typography mt={2} color="text.secondary">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
