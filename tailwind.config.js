/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        accent: '#22c55e',
        'accent-hover': '#16a34a',
        danger: '#ef4444',
        'confidence-high': '#22c55e',
        'confidence-medium': '#eab308',
        'confidence-low': '#ef4444',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
