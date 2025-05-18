// ***** app/lib/styleUtils.ts *****

import { useTheme } from '../app/context/ThemeContext';

export const useThemedStyles = () => {
  const { isDarkMode } = useTheme();

  return {
    // Text colors
    textColor: isDarkMode
      ? 'text-dark-text-primary'
      : 'text-light-text-primary',
    secondaryTextColor: isDarkMode
      ? 'text-dark-text-secondary'
      : 'text-light-text-secondary',
    mutedTextColor: isDarkMode
      ? 'text-dark-text-muted'
      : 'text-light-text-muted',

    // Background colors
    bgColor: isDarkMode ? 'bg-dark-background' : 'bg-light-background',
    cardBgColor: isDarkMode ? 'bg-dark-card' : 'bg-light-card',
    cardHighlightColor: isDarkMode
      ? 'bg-dark-card-highlight'
      : 'bg-light-card-highlight',
    surfaceColor: isDarkMode ? 'bg-dark-surface' : 'bg-light-surface',

    // Border colors
    borderColor: isDarkMode ? 'border-dark-border' : 'border-light-border',

    // Button colors
    buttonBgColor: isDarkMode
      ? 'bg-dark-button-background'
      : 'bg-light-button-background',
    buttonTextColor: isDarkMode
      ? 'text-dark-button-text'
      : 'text-light-button-text',

    // Status colors
    successColor: 'bg-success',
    warningColor: 'bg-warning',
    errorColor: 'bg-error',
    infoColor: 'bg-info',

    // Get colors for icons
    getIconColor: () => (isDarkMode ? '#cbd5e1' : '#64748b'),
    getPrimaryIconColor: () => '#4f46e5',
  };
};
