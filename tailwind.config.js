/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      colors: {
        web: {
          color1: "var(--1)",
          color2: "var(--2)",
          color3: "var(--3)",
          color4: "var(--4)",
        },
        app: {
          background: "#FAFBFC",
          electricGreen: "#15ECDA",
          dark: "#212121",
          white: "#ffffff",
          text: "#9095A1",
          lightGray: "#EDEDED",
          error: "#DD0000",
        },
        sofiaCall: {
          primary: "#3deec6",
          black: "#000000",
          gray2: "#e8eeec",
          grayInput: "#fbfbfa",
          grayBorder: "#cacaca",
          white: "#ffffff",
          green: "#279322",
          red: "#a80707",
          red2: "#e51400",
          yellow: "#ffeca2",
          yellow2: "#b0921f",
          blue: "#2e66e3",
          //UI sidebar
          searchInput: "#E3E3E3",
          searchText: "#757575",
          searchIcon: "#BFBFBF",
          // UI
          electricGreen: "#15ECDA",
          dark: "#212121",
          light: "#F6F6F6",
          lightGray: "#EDEDED",
          gray: "#9D9D9D",
          error: "#DD0000",
          analogo2: "#1593EC",
        },
      },
      fontFamily: {
        poppinsRegular: ["Poppins Regular", "sans-serif"],
        poppinsMedium: ["Poppins Medium", "sans-serif"],
        poppinsSemiBold: ["Poppins SemiBold", "sans-serif"],
        poppinsBold: ["Poppins Bold", "sans-serif"],
      },
      cursor: {
        grab: "grab",
        grabbing: "grabbing",
      },
    },
  },
  variants: {
    extend: {
      cursor: ["active", "focus"],
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
