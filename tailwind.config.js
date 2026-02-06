/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0077b6",      // Dark blue (nav, headings, focus)
        secondary: "#d8e4f7",
        accent: "#90e0ef",       // Light cyan/turquoise (nav hover, form focus)
        danger: "#c62828",       // Red (danger buttons)

        "primary-bg": "#28527a",
        "secondary-bg": "#f1f8ff",
        "danger-bg": "#fdecea",
        "main-bg": "#dae4f6",

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
