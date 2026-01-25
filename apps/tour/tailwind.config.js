/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bodhi: {
          blue: '#4d65ff',
          'blue-light': '#69adff',
          'blue-pale': '#AFCFF5',
          dark: '#1a1a2e',
          light: '#f8f9fa',
          accent: '#4d65ff',
        }
      }
    },
  },
  plugins: [],
}
