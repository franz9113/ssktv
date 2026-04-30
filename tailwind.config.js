/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    keyframes: {
      flashRed: {
        '0%, 100%': { borderColor: 'rgba(239, 68, 68, 0.2)' }, // slate-800 
        '50%': { borderColor: 'rgba(239, 68, 68, 1)' },        // red-500
      }
    },
    animation: {
      'flash-border': 'flashRed 1.5s infinite',
    }
  }
  },
  plugins: [],
}