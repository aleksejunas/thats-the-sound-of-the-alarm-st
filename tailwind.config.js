/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#60a5fa',
        background: '#000000',
        surface: '#1a1a1a',
        border: '#333333',
        text: {
          primary: '#ffffff',
          secondary: '#666666',
        },
      },
    },
  },
  plugins: [],
};
