/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,jsx,ts,tsx}',
  './components/**/*.{js,jsx,ts,tsx}',
];
export const presets = [require('nativewind/preset')];
export const theme = {
  extend: {
    colors: {
      // Main brand colors
      primary: '#4f46e5', // Indigo
      'primary-light': '#818cf8',
      'primary-dark': '#3730a3',
      
      // Light mode
      light: {
        background: '#f8fafc',
        surface: '#ffffff',
        card: '#ffffff',
        'card-highlight': '#f1f5f9',
        border: '#e2e8f0',
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          muted: '#94a3b8',
        },
      },
      
      // Dark mode
      dark: {
        background: '#0f172a',
        surface: '#1e293b',
        card: '#1e293b',
        'card-highlight': '#334155',
        border: '#334155',
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
        },
      },
      
      // System colors
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
  },
};
export const plugins = [];
