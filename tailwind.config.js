/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#057c6b",
          "secondary": "#048c43",
          "accent": "#049482",
          "neutral": "#111827",
          "base-100": "#ffffff",
          "info": "#111827",
          "success": "#22c55e",
          "warning": "#facc15",
          "error": "#dc2626",
        },
      },
    ],
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Archivos de React
    './public/index.html',         // Archivo HTML público
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}


