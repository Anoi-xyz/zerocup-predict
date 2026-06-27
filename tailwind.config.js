/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#020617",
        neonPurple: "#a855f7",
        pureWhite: "#ffffff",
      },
    },
  },
  plugins: [],
};
