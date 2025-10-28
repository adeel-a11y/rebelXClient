// src/components/details/client-details/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: { default: "#fafafa" },
    success: { main: "#34c759" },
    warning: { main: "#f4c74b" },
    error: { main: "#f38ba0" },
    primary: { main: "#5b7fff" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { background: "#fff" } },
    },
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
  },
});

export default theme;
