// src/styles/typography.ts

import { Platform } from 'react-native';

// Define font families (must match loaded fonts)
const fontFamilies = {
  primary: 'NotoSans',        // English
  sinhala: 'IskoolaPota',     // Sinhala
  tamil: 'NotoSansTamil',     // Tamil
};

// Export font families for use in Text styles
export const fontFamily = {
  primary: Platform.select({ ios: 'NotoSans', android: 'NotoSans' }),
  sinhala: Platform.select({ ios: 'IskoolaPota', android: 'IskoolaPota' }),
  tamil: Platform.select({ ios: 'NotoSansTamil', android: 'NotoSansTamil' }),
};

// Font Sizes (in numbers, not strings)
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
  '4xl': 48,
  '5xl': 60,
  '6xl': 72,
};

// Font Weights (as numbers)
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Line Heights (as numbers)
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter Spacing (NOT supported in React Native as strings)
// You can define it as numbers in pixels (but rarely used)
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.2,
};

// Reusable Typography Styles (✅ Use These in Your Components)
export const textVariants = {
  title: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  heading: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  subtitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  body: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodySinhala: {
    fontFamily: fontFamilies.sinhala,
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodyTamil: {
    fontFamily: fontFamilies.tamil,
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  button: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  label: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
};

export default {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textVariants,
};
