// Theme configuration for the app

export const colors = {
  primary: '#007AFF',
  secondary: '#FF3B30',
  background: '#F2F2F7',
  white: '#FFF',
  black: '#000',
  gray: {
    100: '#F4F3F4',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#767577',
    600: '#666666',
    700: '#999999',
  },
};

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 15,
    md: 16,
    lg: 17,
    xl: 24,
    xxl: 34,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const shadows = {
  base: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};