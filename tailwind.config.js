/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          dark: '#050508',
          panel: '#0a0a10',
          accent: '#00f0ff',
          gold: '#ffd700',
          success: '#00ff88',
          warning: '#ffaa00',
          danger: '#ff4444'
        }
      }
    }
  },
  plugins: [],
}
