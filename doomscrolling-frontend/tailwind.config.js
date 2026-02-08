/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        doom: {
          bg: "#07080A",
          panel: "#0E1014",
          panel2: "#131722",
          red: "#E10600",
          red2: "#B40500",
          steel: "#8B93A7",
          acid: "#6BFF6B",
          warn: "#FFB020",
        },
      },
      boxShadow: {
        doom: "0 0 0 2px rgba(225,6,0,0.8), 0 12px 40px rgba(0,0,0,0.6)",
        hud: "0 0 0 1px rgba(139,147,167,0.25), 0 10px 30px rgba(0,0,0,0.55)",
      },
    },
  },
  plugins: [],
};
