const { postcss, tailwindcss } = require('tailwindcss');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/*.{ts,vue,css}"
  ],
  theme: {
    extend: {},
  },
  plugins:[],
}

