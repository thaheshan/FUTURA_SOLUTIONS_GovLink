// App/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import colors from './Colors';
import spacing from './Spacing';
import typography from './Typography';

// Shadows
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

const globalStyles = StyleSheet.create({
  // === LAYOUT ===
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.md,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  rowSpaceBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  center: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // === TYPOGRAPHY ===
  title: { 
    ...typography.textVariants.title, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm 
  },
  heading: { 
    ...typography.textVariants.heading, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm 
  },
  subtitle: { 
    ...typography.textVariants.subtitle, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm 
  },
  body: { 
    ...typography.textVariants.body, 
    color: colors.textPrimary 
  },
  bodySinhala: { 
    ...typography.textVariants.bodySinhala, 
    color: colors.textPrimary 
  },
  bodyTamil: { 
    ...typography.textVariants.bodyTamil, 
    color: colors.textPrimary 
  },
  buttonText: { 
    ...typography.textVariants.button, 
    color: colors.white, 
    textAlign: 'center' 
  },
  label: { 
    ...typography.textVariants.label, 
    color: colors.textSecondary 
  },
  caption: { 
    ...typography.textVariants.caption, 
    color: colors.textSecondary 
  },

  // === BUTTONS ===
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // === INPUTS ===
  input: {
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    ...typography.textVariants.body,
  },
  inputError: { 
    borderColor: colors.error 
  },

  // === CARDS ===
  card: { 
    backgroundColor: colors.white, 
    borderRadius: 8, 
    padding: spacing.md, 
    marginBottom: spacing.md, 
    ...shadow 
  },
  cardElevated: { 
    backgroundColor: colors.white, 
    borderRadius: 8, 
    padding: spacing.md, 
    marginBottom: spacing.md, 
    ...shadowLg 
  },

  // === SECTIONS ===
  section: { 
    marginBottom: spacing.lg 
  },
  sectionTitle: { 
    ...typography.textVariants.subtitle, 
    color: colors.primary, 
    marginBottom: spacing.sm 
  },

  // === DETAIL ROWS ===
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: spacing.sm 
  },
  detailLabel: { 
    ...typography.textVariants.label, 
    color: colors.textSecondary 
  },
  detailValue: { 
    ...typography.textVariants.body, 
    fontWeight: '500', 
    color: colors.textPrimary 
  },

  // === UTILITIES ===
  textCenter: { 
    textAlign: 'center' 
  },
  textRight: { 
    textAlign: 'right' 
  },
  divider: { 
    height: 1, 
    backgroundColor: colors.borderSecondary, 
    marginVertical: spacing.md 
  },
  errorText: { 
    ...typography.textVariants.caption, 
    color: colors.error, 
    marginTop: spacing.xs 
  },
});

export default globalStyles;