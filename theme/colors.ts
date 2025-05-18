// ***** app/theme/colors.ts *****
// Color palette definitions that can be used across the app

export const colorPalette = {
  // Main brand colors
  primary: '#272932',
  // primary: '#FFBA49',
  // primaryLight: '#818cf8',
  primaryLight: '#FFBA49',
  primaryDark: '#D64933',

  // UI colors
  lightBackground: '#f8fafc',
  lightSurface: '#ffffff',
  lightCard: '#ffffff',
  lightCardHighlight: '#f1f5f9',
  lightBorder: '#e2e8f0',
  lightTextPrimary: '#0f172a',
  lightTextFocusTips: '#ffffff',
  lightTextSecondary: '#64748b',
  lightTextMuted: '#94a3b8',
  lightButtonBackground: '#ffffff',
  lightButtonText: '#0f172a',

  darkBackground: '#0f172a',
  darkSurface: '#1e293b',
  darkCard: '#1e293b',
  darkCardHighlight: '#334155',
  darkBorder: '#334155',
  darkTextPrimary: '#f8fafc',
  darkTextFocusTips: '#ffffff',
  darkTextSecondary: '#cbd5e1',
  darkTextMuted: '#94a3b8',
  darkButtonBackground: '#334155',
  darkButtonText: '#f8fafc',

  // System colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',

  // Additional palette colors
  lilac: '#D0A3BF',
  teaRose: '#D6BBC0',
  skyMagenta1: '#C585B3',
  skyMagenta2: '#BC69AA',
  purpureus: '#AF42AE',
  sunglow: '#FFCA3A',
  bitterSweet: '#FF595E',
  steelBlue: '#1982C4',
  ultraViolet: '#6A4C93',
  pinkLavender: '#D1B1CB',
  hookersGreen: '#4E6E58',
  xhantous: '#FFBA49',
  lightSeaGreen: '#20A39E',
  icterine: '#F0F757',
  spaceCadet: '#34344A',
  dutchWhite: '#F2E3BC',
  carrotOrange: '#F49D37',
  crimson: '#D72638',
  raisinBlack: '#272932',
  redOrange: '#D64933',
  mintCream: '#EAF2EF',
  quinacridoneMagenta: '#912F56',
};

// This function creates a themed color object based on dark/light mode
export const getThemedColors = (isDarkMode: boolean) => {
  return {
    background: isDarkMode
      ? colorPalette.darkBackground
      : colorPalette.lightBackground,
    surface: isDarkMode ? colorPalette.darkSurface : colorPalette.lightSurface,
    card: isDarkMode ? colorPalette.darkCard : colorPalette.lightCard,
    cardHighlight: isDarkMode
      ? colorPalette.darkCardHighlight
      : colorPalette.lightCardHighlight,
    border: isDarkMode ? colorPalette.darkBorder : colorPalette.lightBorder,
    text: {
      primary: isDarkMode
        ? colorPalette.darkTextPrimary
        : colorPalette.lightTextPrimary,
      focusTips: isDarkMode
        ? colorPalette.darkTextFocusTips
        : colorPalette.lightTextFocusTips,
      secondary: isDarkMode
        ? colorPalette.darkTextSecondary
        : colorPalette.lightTextSecondary,
      muted: isDarkMode
        ? colorPalette.darkTextMuted
        : colorPalette.lightTextMuted,
    },
    button: {
      background: isDarkMode
        ? colorPalette.darkButtonBackground
        : colorPalette.lightButtonBackground,
      text: isDarkMode
        ? colorPalette.darkButtonText
        : colorPalette.lightButtonText,
    },
    primary: colorPalette.primary,
    primaryLight: colorPalette.primaryLight,
    primaryDark: colorPalette.primaryDark,
    success: colorPalette.success,
    warning: colorPalette.warning,
    error: colorPalette.error,
    info: colorPalette.info,
  };
};

// This type represents the return value of getThemedColors
export type ThemeColors = ReturnType<typeof getThemedColors>;
