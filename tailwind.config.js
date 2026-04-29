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
        warning: "#d78f00",
        info: "#0077b6",
        "info-light": "#e6f3fb", // Soft info background (results panels)
        success: "#66bb6a",

        "primary-border": "#7fc3d4", // Structural border (distinct from accent)
        "item-hover": "#b0e2eb",
        "muted": "#5b6b7a",          // Muted body text (replaces gray-500/600/800)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        // Add custom spacing values here
      },
    },
  },
  safelist: ['text-success', 'text-warning', 'text-error'],
  darkMode: "class", // or "media" for system preference
  plugins: [
    // Add Tailwind plugins here
  ],
}
