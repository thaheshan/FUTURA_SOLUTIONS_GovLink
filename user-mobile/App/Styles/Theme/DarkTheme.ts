// src/styles/theme/darkTheme.ts

import colors from '../Colors';
import typography from '../Typography';
import spacing from '../Spacing';

// Define shadows first (avoid self-reference)
const shadow = {
  shadowColor: colors.white,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
};

const shadowLg = {
  ...shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
};

// Now define the theme
const darkTheme = {
  // === Core Design System ===
  colors,
  typography,
  spacing,

  // === Theme Mode ===
  mode: 'dark' as const,

  // === Backgrounds ===
  background: {
    primary: colors.black,           // #26303B
    secondary: '#1A1A1A',
    card: '#2D2D2D',
    surface: '#222222',
  },

  // === Text Colors ===
  text: {
    primary: colors.white,
    secondary: '#CCCCCC',
    disabled: '#888888',
    hint: '#AAAAAA',
  },

  // === Primary & Secondary ===
  primary: {
    main: colors.primary,            // #A7D5D7
    contrastText: colors.black,
    light: '#C7E5E7',
    dark: '#87C5C7',
  },
  secondary: {
    main: colors.secondary,          // #9BDADC
    contrastText: colors.black,
    light: '#BDEDEE',
    dark: '#7BBBCC',
  },

  // === Buttons ===
  button: {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.black,
    },
    secondary: {
      backgroundColor: colors.secondary,
      textColor: colors.black,
    },
    outline: {
      borderColor: colors.primary,
      textColor: colors.primary,
    },
  },

  // === Card ===
  card: {
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    ...shadow,
  },

  // === Input ===
  input: {
    backgroundColor: '#333333',
    borderColor: '#555555',
    textColor: colors.white,
    placeholderColor: '#888888',
  },

  // === Shadows (Reusable) ===
  shadow,
  shadowLg,

  // === Border ===
  border: {
    color: '#444444',
    width: 1,
  },

  // === Status Colors ===
  error: {
    main: colors.error,              // #FF5252
    light: '#FF8282',
    contrastText: colors.white,
  },
  success: {
    main: colors.success,            // #4CAF50
    light: '#7CCF80',
    contrastText: colors.white,
  },

  // === Typography ===
  typographyVariants: typography.textVariants,
};

// Fix: Cannot use `darkTheme.shadow` above — so assign after
(darkTheme as any).card = {
  ...darkTheme.card,
  ...darkTheme.shadow,
};

export default darkTheme;