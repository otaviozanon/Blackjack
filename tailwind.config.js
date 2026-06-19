/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#0a0a0a',
        gold: {
          light: '#F9D71C',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
        },
        casino: {
          green: '#064e3b',
          'green-dark': '#022c22',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
