export const colors = {
  // Primary
  primary: '#10b981',
  primaryDark: '#059669',
  primaryLight: '#d1fae5',

  // Secondary
  secondary: '#6366f1',
  secondaryDark: '#4f46e5',
  secondaryLight: '#e0e7ff',

  // Accent
  accent: '#f59e0b',
  accentDark: '#d97706',
  accentLight: '#fef3c7',

  // Neutrals
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',

  // Semantic
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Categories
  categories: {
    Dairy: '#3b82f6',
    Protein: '#ef4444',
    Vegetable: '#22c55e',
    Fruit: '#f59e0b',
    Grain: '#a855f7',
    Meat: '#dc2626',
    Pantry: '#64748b',
    Seafood: '#06b6d4',
    Frozen: '#0ea5e9',
    Unknown: '#94a3b8',
  } as Record<string, string>,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
