/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: {
          primary: {
            0: "#EA8C11",
            1: "#FB7A0A",
            2: "#DDD92B",
            3: "#FFEECF",
            4: "#FB7701",
            5: "#D52B4E",
          },
        },
        green: {
          primary: {
            0: "#5C8738",
            1: "#FB7A0A",
            2: "#DDD92B",
            3: "#FFEECF",
          },
        },
        blue: {
          primary: {
            0: "#5C8738",
            1: "#FB7A0A",
            2: "#DDD92B",
            3: "#FFEECF",
          },
        },
      },
    },
  },
  plugins: [],
};
