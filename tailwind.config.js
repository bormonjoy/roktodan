/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B71C1C',
          light: '#D32F2F',
          dark: '#7F0000',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F5F5F5',
          dark: '#212121',
        },
        success: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
        },
        warning: {
          DEFAULT: '#F57C00',
          light: '#FFB74D',
        },
        error: {
          DEFAULT: '#C62828',
          light: '#EF5350',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};