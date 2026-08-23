/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ethiopian-inspired accent palette (flag-adjacent, not literal flag)
        sheger: {
          bg: '#0b0b0f',
          surface: '#15151c',
          card: '#1c1c26',
          green: '#0f8a4b',
          yellow: '#f5c518',
          red: '#c8352d',
          text: '#f2f2f5',
          muted: '#9a9aa5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nav: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
