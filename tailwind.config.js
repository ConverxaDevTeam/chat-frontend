/** @type {import("tailwindcss").Config} */

import plugin from "tailwindcss";

export default {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "normal", fontWeight: "600" }],
        sm: ["14px", { lineHeight: "normal", fontWeight: "600" }],
        base: ["16px", { lineHeight: "normal", fontWeight: "600" }],
        tiny: [
          "10px",
          {
            lineHeight: "normal",
            fontWeight: "600",
            fontFeatureSettings: "'liga' off, 'clig' off",
          },
        ],
      },
      colors: {
        app: {
          primary: "#15ECDA",
          text: "#001126",
          newGray: "#A6A8AB",
          c3: "#F6F6F6",
          white: "#FFFFFF",
          background: "#FAFBFC",
          electricGreen: "#15ECDA",
          dark: "#212121",
          gray: "#A1A1A1",
          lightGray: "#EDEDED",
          error: "#DD0000",
          c1: "#fafafa",
          c2: "#ffffff",
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
          blancoPuro: "#FFFFFF",
          celeste: "#F6FBFF",
          hitlPending: "#FFBB93",
          error: "#FF616D",
          navyBlue: "#343E4F",
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
