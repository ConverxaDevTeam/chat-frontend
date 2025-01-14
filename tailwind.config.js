/** @type {import("tailwindcss").Config} */

import plugin from "tailwindcss";

export default {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      colors: {
        app: {
          background: "#FAFBFC",
          electricGreen: "#15ECDA",
          dark: "#212121",
          white: "#ffffff",
          gray: "#A1A1A1",
          text: "#9095A1",
          lightGray: "#EDEDED",
          newGray: "#A6A8AB",
          error: "#DD0000",
          c1: "#fafafa",
          c2: "#ffffff",
          c3: "#ebebeb",
          c4: "#020202",
        },
        sofia: {
          superDark: "#001126",
          darkBlue: "#DBEAF2",
          electricOlive: "#BAF88F",
          electricLight: "#DDFBC7",
          electricGreen: "#15ECDA",
          background: "#F6F6F6",
          secundario: "#d0fbf8",
          blancoPuro: "#ffffff",
          celeste: "#F2F9FF",
        },
      },
      cursor: {
        grab: "grab",
        grabbing: "grabbing",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(130deg, #f6f9fb 0%, #f0f4f9 40%, #edf2f7 100%)",
        "diagram-gradient":
          "radial-gradient(circle at center, transparent 0%, #F6F6F6 80%)",
        "node-gradient":
          "radial-gradient(89.63% 89.63% at 50% 50%, #F1F5F9 0%, #D0FBF8 100%)",
      },
    },
  },
  variants: {
    extend: {
      cursor: ["active", "focus"],
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".roboto-thin": {
          fontWeight: "100",
          fontStyle: "normal",
        },
        ".roboto-light": {
          fontWeight: "300",
          fontStyle: "normal",
        },
        ".roboto-regular": {
          fontWeight: "400",
          fontStyle: "normal",
        },
        ".roboto-medium": {
          fontWeight: "500",
          fontStyle: "normal",
        },
        ".roboto-bold": {
          fontWeight: "700",
          fontStyle: "normal",
        },
        ".roboto-black": {
          fontWeight: "900",
          fontStyle: "normal",
        },
        ".roboto-thin-italic": {
          fontWeight: "100",
          fontStyle: "italic",
        },
        ".roboto-light-italic": {
          fontWeight: "300",
          fontStyle: "italic",
        },
        ".roboto-regular-italic": {
          fontWeight: "400",
          fontStyle: "italic",
        },
        ".roboto-medium-italic": {
          fontWeight: "500",
          fontStyle: "italic",
        },
        ".roboto-bold-italic": {
          fontWeight: "700",
          fontStyle: "italic",
        },
        ".roboto-black-italic": {
          fontWeight: "900",
          fontStyle: "italic",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
