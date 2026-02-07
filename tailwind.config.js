/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#28527a",      // Dark blue (nav, headings, focus)
        secondary: "#d8e4f7",
        tertiary: "#f1f8ff",     // Light blue (backgrounds, cards)
        accent: "#90e0ef",       // Light cyan/turquoise (nav hover, form focus)
        error: "#c62828",       // Red (danger buttons)
        warning: "#ffab00",
        info: "#0077b6",
        success: "#66bb6a",

        "primary-border": "#90e0ef",
        "item-hover": "#b0e2eb",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        // Add custom spacing values here
      },
    },
  },
  darkMode: "class", // or "media" for system preference
  plugins: [
    // Add Tailwind plugins here
  ],
}
