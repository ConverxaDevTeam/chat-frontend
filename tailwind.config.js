/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      colors: {
        app: {
          background: "#FAFBFC",
          electricGreen: "#15ECDA",
          dark: "#212121",
          white: "#ffffff",
          gray: "#A1A1A1",
          text: "#9095A1",
          lightGray: "#EDEDED",
          error: "#DD0000",
          c1: "#fafafa",
          c2: "#ffffff",
          c3: "#ebebeb",
          c4: "#020202",
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
