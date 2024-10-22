/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Archivos de React
    './public/index.html',         // Archivo HTML público
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}


