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
          primary: '#1B7FD4',
          dark: '#0F3D6E',
          deeper: '#0A2744',
          light: '#E8F4FD',
        },
        yellow: {
          DEFAULT: '#F5C200',
          dark: '#D4A800',
        },
        red: {
          DEFAULT: '#CC2222',
        },
        gray: {
          light: '#E9ECEF',
          mid: '#ADB5BD',
          text: '#495057',
        },
        dark: '#1A1A2E',
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
