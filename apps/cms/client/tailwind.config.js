/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bodhi: {
          blue: '#0066CC',
          dark: '#1a1a2e',
          light: '#f8f9fa',
          accent: '#00d4aa',
        }
      }
    }
  },
  plugins: []
}
