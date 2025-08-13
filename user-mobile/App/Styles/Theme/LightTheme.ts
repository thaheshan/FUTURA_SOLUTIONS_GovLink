// src/styles/theme/lightTheme.ts

import colors from '../Colors';
import typography from '../Typography';
import spacing from '../Spacing';

// Define shadows first
const shadow = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
};

const shadowLg = {
  ...shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
};

const lightTheme = {
  colors,
  typography,
  spacing,
  mode: 'light' as const,

  background: {
    primary: colors.backgroundPrimary,
    secondary: colors.backgroundSecondary,
    card: colors.white,
    surface: colors.white,
  },

  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    disabled: colors.gray,
    hint: colors.lightGray,
  },

  primary: {
    main: colors.primary,
    contrastText: colors.white,
  },
  secondary: {
    main: colors.secondary,
    contrastText: colors.white,
  },

  button: {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.white,
    },
    secondary: {
      backgroundColor: colors.secondary,
      textColor: colors.white,
    },
    outline: {
      borderColor: colors.primary,
      textColor: colors.primary,
    },
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
  },

  input: {
    backgroundColor: colors.white,
    borderColor: colors.gray,
    textColor: colors.textPrimary,
    placeholderColor: colors.lightGray,
  },

  shadow,
  shadowLg,

  border: {
    color: colors.lightGray,
    width: 1,
  },

  error: {
    main: colors.error,
    contrastText: colors.white,
  },
  success: {
    main: colors.success,
    contrastText: colors.white,
  },

  typographyVariants: typography.textVariants,
};

// Apply shadow after definition
(lightTheme as any).card = {
  ...lightTheme.card,
  ...lightTheme.shadow,
};

export default lightTheme;