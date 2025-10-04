import { React } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const AppBarTop = ({ message }) => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" noWrap>
            WORKPlace
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography variant="subtitle2" color="text.secondary">
            {message || "Dashboard"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" size="small">
            Export
          </Button>
          <Avatar alt="User" src={null} sx={{ width: 36, height: 36 }}>
            {user.name[0].toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarTop;
