// src/styles/Colors.ts
export const colors = {
  // === PRIMARY COLORS ===
  primary: '#0D141C',
  primaryLight: '#1A2532',
  primaryDark: '#000000',

  // === SECONDARY COLORS ===
  secondary: '#4D7399',
  secondaryLight: '#6B8BB3',
  secondaryDark: '#3A5A7F',

  // === BACKGROUND COLORS ===
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#E8EDF2',
  backgroundTertiary: '#F5F7FA',

  // === TEXT COLORS ===
  textPrimary: '#0D141C',
  textSecondary: '#4D7399',
  textTertiary: '#8A9BAD',
  textMuted: '#B5C4D1',
  textPlaceholder: '#4D7399',

  // === STATUS COLORS ===
  success: '#28A745',
  successLight: '#D4EDDA',
  successDark: '#1E7E34',

  error: '#E53E3E',
  errorLight: '#FFF5F5',
  errorDark: '#C53030',

  warning: '#FFC107',
  warningLight: '#FFF3CD',
  warningDark: '#E0A800',

  info: '#17A2B8',
  infoLight: '#D1ECF1',
  infoDark: '#138496',

  // === BORDER COLORS ===
  border: '#E8EDF2',
  borderSecondary: '#D1D5DB',
  borderActive: '#0D141C',
  borderError: '#E53E3E',

  // === BUTTON COLORS ===
  buttonPrimary: '#0D141C',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#E8EDF2',
  buttonSecondaryText: '#0D141C',
  buttonDisabled: '#E8EDF2',
  buttonDisabledText: '#4D7399',

  // === INPUT COLORS ===
  inputBackground: '#E8EDF2',
  inputBackgroundFocused: '#FFFFFF',
  inputBackgroundError: '#FFF5F5',
  inputBorder: '#D1D5DB',
  inputBorderFocused: '#0D141C',
  inputBorderError: '#E53E3E',

  // === UTILITIES ===
  white: '#FFFFFF',
  black: '#000000',
  gray: '#D1D5DB',
  lightGray: '#B5C4D1',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

export default colors;