// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cardano: '#0033AD',
        avalanche: '#E84142',
        darkbg: '#0A1A3F',
        genuine: '#10B981',
        fake: '#EF4444'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
