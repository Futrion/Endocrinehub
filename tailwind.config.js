/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0077b6",      // Dark blue (nav, headings, focus)
        accent: "#90e0ef",       // Light cyan/turquoise (nav hover, form focus)
        danger: "#c62828",       // Red (danger buttons)
      },
      fontFamily: {
        sans: ["'Segoe UI'", 'Arial', 'sans-serif'],
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
