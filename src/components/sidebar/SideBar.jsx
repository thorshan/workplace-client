import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Apartment as ApartmentIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import DepartmentAccordion from "./DepartmentAccordion";

const drawerWidth = 260;

const SideBar = ({ menuOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      text: "Overview",
      icon: <DashboardIcon />,
      path: "/",
      roles: [ROLES.ADMIN, ROLES.HR, ROLES.FINANCE, ROLES.SALES],
    },
    {
      text: "Reports",
      icon: <BarChartIcon />,
      path: "/reports",
      roles: [ROLES.ADMIN, ROLES.HR, ROLES.FINANCE, ROLES.SALES],
    },
  ];

  const hrLinks = [
    { text: "Dashboard", path: "/hr" },
    { text: "Employee Management", path: "/hr/manage" },
    { text: "Attendance", path: "/hr/attendance-sheets" },
    { text: "Leaves", path: "/hr/leaves" },
    { text: "Holidays", path: "/hr/holidays" },
  ];

  const financeLinks = [
    { text: "Dashboard", path: "/finance" },
    { text: "Payroll", path: "/finance/payroll" },
    { text: "Expense", path: "/finance/expense" },
    { text: "Budget Report", path: "/finance/report" },
    { text: "Invoices & Payments", path: "/finance/invoices" },
  ];

  const salesLinks = [
    { text: "Dashboard", path: "/sales" },
    { text: "Leads", path: "/sales/leads" },
    { text: "Campaigns", path: "/sales/campaigns" },
    { text: "Clients", path: "/sales/clients" },
  ];

  const departments = [
    {
      title: "HR Department",
      icon: <WorkIcon />,
      links: hrLinks,
      roles: [ROLES.ADMIN, ROLES.HR],
    },
    {
      title: "Finance Department",
      icon: <AccountBalanceIcon />,
      links: financeLinks,
      roles: [ROLES.ADMIN, ROLES.FINANCE],
    },
    {
      title: "Sales & Marketing",
      icon: <StorefrontIcon />,
      links: salesLinks,
      roles: [ROLES.ADMIN, ROLES.SALES],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {user.name[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="caption" color="text.primary">
              {user.role.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Menu */}
        <List>
          {menuItems
            .filter((i) => i.roles.includes(user.role))
            .map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton href={item.path} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

          {/* Admin-only Users */}
          {user.role === ROLES.ADMIN && (
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton href="/users" sx={{ borderRadius: 1 }}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users Managment" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Departments */}
        <Typography variant="overline" sx={{ pl: 2, color: "text.secondary" }}>
          Departments
        </Typography>
        <List>
          {departments
            .filter((d) => d.roles.includes(user.role))
            .map((dept) => (
              <DepartmentAccordion
                key={dept.title}
                title={dept.title}
                icon={dept.icon}
                links={dept.links}
                open={menuOpen}
              />
            ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          variant="outlined"
          size="small"
          onClick={logout}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default SideBar;
