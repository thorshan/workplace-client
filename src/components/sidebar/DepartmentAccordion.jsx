import React, { memo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const DepartmentAccordion = memo(({ title, icon, links = [] }) => (
  <Accordion disableGutters elevation={0} square>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ pl: 2 }}>
      <List>
        {links.map((link) => (
          <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={link.path}
              sx={{ borderRadius: 1 }}
            >
              <ListItemText primary={link.text} sx={{ pl: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </AccordionDetails>
  </Accordion>
));

export default DepartmentAccordion;
