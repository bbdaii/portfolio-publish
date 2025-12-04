/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
      },
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        noto: ['"Noto Sans TC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 