/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#1f1f1f", // sidebar background (dark)
          border: "#2f2f2f", // sidebar border
          accent: "#5B5FC7", // active icon color
          foreground: "#a1a1a1", // inactive icon color
        },
        primary: "#5B5FC7",
      },
    },
  },
  plugins: [],
};
