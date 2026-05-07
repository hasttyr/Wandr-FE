/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdf8f0', 100: '#f9eedc', 200: '#f2d9b0', 300: '#e8bf7d',
          400: '#dca04a', 500: '#ce8328', 600: '#b56b1e', 700: '#955219',
          800: '#784119', 900: '#623618',
        },
        rust: { 400: '#ff7d58', 500: '#f95328', 600: '#e03414' },
        teal: { 400: '#2dd4aa', 500: '#14b98b', 600: '#0a9470' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
