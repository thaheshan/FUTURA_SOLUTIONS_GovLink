// src/Styles/Theme/LightTheme.ts

import { DefaultTheme } from "styled-components/native";

// Define your light theme colors
export const lightTheme: DefaultTheme = {
  colors: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#1E90FF",
    secondary: "#FF6347",
    border: "#E0E0E0",
    card: "#F9F9F9",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
  },
};

// If you want default import instead of named import
export default lightTheme;
