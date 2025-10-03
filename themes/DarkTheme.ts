import type { ThemeTypes } from "@/types/themeTypes/ThemeType";

const DARK_THEME: ThemeTypes = {
  name: "DARK_THEME",
  dark: true,
  variables: {
    "border-color": "#2d3748",
    "border-opacity": 1,
  },
  colors: {
    primary: "#60a5fa",
    secondary: "#34d399",
    info: "#3b82f6",
    success: "#10b981",
    accent: "#f59e0b",
    warning: "#f59e0b",
    error: "#ef4444",
    lightprimary: "rgba(96, 165, 250, 0.1)",
    profileIconBgColor: "rgba(96, 165, 250, 0.1)",
    lightsecondary: "rgba(52, 211, 153, 0.1)",
    lightsuccess: "rgba(16, 185, 129, 0.1)",
    lighterror: "rgba(239, 68, 68, 0.1)",
    lightinfo: "rgba(59, 130, 246, 0.1)",
    lightwarning: "rgba(245, 158, 11, 0.1)",
    textPrimary: "#f7fafc",
    textSecondary: "#e2e8f0",
    borderColor: "#2d3748",
    inputBorder: "#4a5568",
    containerBg: "#1a202c",
    background: "#0f172a",
    hoverColor: "#2d3748",
    surface: "#1e293b",
    "on-surface-variant": "#334155",
    grey100: "#2d3748",
    grey200: "#4a5568",
  },
};

export { DARK_THEME };
