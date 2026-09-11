// Central theme file. Change values here to re-theme the whole app.
export const colors = {
  // Brand
  primary: '#FF3E86',      // main pink (buttons, active states)
  primaryDark: '#D81B60',  // pressed / gradient end
  primaryLight: '#FFE3EE', // soft pink backgrounds, chips
  accent: '#FF7AA8',       // secondary pink accent

  // Neutrals
  background: '#FAFAFC',
  surface: '#FFFFFF',
  border: '#F0E4EA',

  // Text
  textPrimary: '#1E1B2E',
  textSecondary: '#8A8494',
  textMuted: '#B7B0BE',

  // Status
  success: '#22C55E',
  successBg: '#E7F9EE',
  warning: '#F59E0B',
  warningBg: '#FFF4E0',
  danger: '#EF4444',

  white: '#FFFFFF',
};

export const gradients = {
  primary: ['#FF3E86', '#FF7AA8'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' },
  h2: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  small: { fontSize: 12, fontWeight: '400' },
};
