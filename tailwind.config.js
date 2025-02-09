/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "!./node_modules/**/*"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#6A1B1B",
        backgroundColor: "#FAF9F6",
        textColor: "#3A3936",
        successColor: "#0E6810",
      },
      fontFamily: {
        heading: ["Bodoni Moda", "serif"],
        body: ["Open Sans Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};
