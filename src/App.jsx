import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    mode: "dark", // "light" or "dark"
    background: {
      default: "#363636ff",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
