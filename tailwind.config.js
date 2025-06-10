/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        primary: '#272932',
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
            focusTips: '#fff',
            secondary: '#64748b',
            muted: '#94a3b8',
          },
          button: {
            background: '#fff',
            text: '#0f172a',
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
            focusTips: '#ffffff',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          },
          button: {
            background: '#334155',
            text: '#f8fafc',
          },
        },

        // System colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
      },
    },
  },
  plugins: [],
};

// -- Great Colors to use?

// #D0A3BF Lilac
// #D6BBC0 Tea Rose (red)
// #C585B3 Sky Magenta I
// #BC69AA Sky Magenta II
// #AF42AE Purpureus
// #FFCA3A Sunglow
// #FF595E Bitter sweet
// #1982C4 Steel Blue
// #6A4C93 Ultra Violet
// #D1B1CB Pink Lavender
// #4E6E58 Hookers Green
// #FFBA49 Xanthous
// #20A39E Light Sea Green
// #F0F757 Icterine
// #34344A Space Cadet
// #F2E3BC Dutch White
// #F49D37 Carrot Orange
// #D72638 Crimson
// #D9D0DE Lavender web
// #5D675B Ebony
// #F1BB87 Buff
// #F7EF99 Flax
// #EE7B30 Pumpkin
// #134611 Pakistan Green
// #29335C Delft
// #323031 Jet
// #084C61 Midnight Green
// #585B56 Davy's Grey
// #386150 Hunter Green
// #0F7173 Caribbean current
// #F1C6A7 Light Apricot
// #272932 Raisin Black
// #D64933 Red Orange
// #EAF2EF Mint Cream
// #912F56 Quinacridone magenta
