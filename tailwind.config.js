/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,jsx,ts,tsx}',
  './components/**/*.{js,jsx,ts,tsx}',
];
export const presets = [require('nativewind/preset')];
export const theme = {
  extend: {
    colors: {
      primary: '#00ff00',
      // primary: '#60a5fa',
      background: '#000000',
      surface: '#1a1a1a',
      border: '#333333',
      text: {
        primary: '#ffffff',
        secondary: '#666666',
      },
    },
  },
};
export const plugins = [];
