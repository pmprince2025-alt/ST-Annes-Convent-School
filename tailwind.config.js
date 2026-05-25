/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          primary: '#2563EB', // Vibrant Blue 600
          dark: '#1E3A8A',    // Deep Blue 900
          deeper: '#0F172A',  // Slate 950
          light: '#F0F7FF',   // Very light blue tint
        },
        yellow: {
          DEFAULT: '#F59E0B', // Amber 500
          dark: '#D97706',    // Amber 700
        },
        red: {
          DEFAULT: '#EF4444', // Red 500
        },
        gray: {
          light: '#F1F5F9',   // Slate 100
          mid: '#94A3B8',     // Slate 400
          text: '#334155',    // Slate 700
        },
        dark: '#020617',      // Extremely dark slate
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
