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
} from "@mui/material";
import employeeApiClient from "../../api/employeeApiClient";

const Profile = () => {
  const [profile, setProfile] = useState(null);

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
    } catch (error) {
      console.error("Error fetching employee profile:", error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("empEmail");
    localStorage.removeItem("empToken");
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
            <strong>Department:</strong> {profile.department?.name || "N/A"}
          </Typography>
          <Typography>
            <strong>Position:</strong> {profile.position || "N/A"}
          </Typography>
          <Typography>
            <strong>Joined Date:</strong>{" "}
            {profile.joinedDate
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
    </Box>
  );
};

export default Profile;
