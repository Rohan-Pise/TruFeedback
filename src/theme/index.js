import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff9800", // Orange
    },
    secondary: {
      main: "#f44336", // Optional: Red
    },
    background: {
      default: "#f9f9f9",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevent uppercase
        },
      },
    },
  },
});

export default theme;