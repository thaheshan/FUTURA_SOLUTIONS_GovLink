import { StyleSheet } from 'react-native';
import colors from './Colors';
import spacing from './Spacing';
import typography from './Typography';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 2,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.md,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.sm,
    ...typography.input,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  shadow: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
