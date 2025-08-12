import { Platform } from 'react-native';

const typography = {
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
  },
  // Platform-specific adjustments
  ...Platform.select({
    android: {
      // Android specific overrides
      header: {
        fontSize: 22,
      }
    },
    ios: {
      // iOS specific overrides
      header: {
        fontSize: 24,
      }
    },
  }),
};

export default typography;