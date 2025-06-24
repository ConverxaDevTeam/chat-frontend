/** @type {import("tailwindcss").Config} */

import plugin from "tailwindcss";

export default {
  content: ["src/**/*.{html,js,jsx,ts,tsx}", "index.html"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Satoshi Regular", "sans-serif"],
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
          primary: "#576aaf",
          text: "#393939",
          newGray: "#A6A8AB",
          c3: "#f6f6f6",
          white: "#FFFFFF",
          background: "#f6f6f6",
          electricGreen: "#7cc1c4",
          dark: "#393939",
          gray: "#A1A1A1",
          lightGray: "#f6f6f6",
          error: "#ac4e4c",
          c1: "#fafafa",
          c2: "#ffffff",
          c4: "#393939",
          // Colores copiados de sofia
          superDark: "#393939",
          darkBlue: "#576aaf",
          darkLight: "#393939",
          electricOlive: "#7cc1c4",
          electricLight: "#7cc1c4",
          secundario: "#f6f6f6",
          blancoPuro: "#FFFFFF",
          celeste: "#f6f6f6",
          hitlPending: "#6d5638",
          navyBlue: "#576aaf",
        },
        sofia: {
          superDark: "#393939",
          darkBlue: "#576aaf",
          darkLight: "#393939",
          electricOlive: "#7cc1c4",
          electricLight: "#7cc1c4",
          electricGreen: "#7cc1c4",
          background: "#f6f6f6",
          secundario: "#f6f6f6",
          blancoPuro: "#FFFFFF",
          celeste: "#f6f6f6",
          hitlPending: "#6d5638",
          error: "#ac4e4c",
          navyBlue: "#576aaf",
        },
      },
      cursor: {
        grab: "grab",
        grabbing: "grabbing",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(130deg, #f6f9fb 0%, #f0f4f9 40%, #edf2f7 100%)",
        "sofia-gradient1": "linear-gradient(180deg, #7cc1c4 0%, #7cc1c4 100%)",
        "diagram-gradient":
          "radial-gradient(circle at center, transparent 0%, #f6f6f6 80%)",
        "node-gradient":
          "radial-gradient(89.63% 89.63% at 50% 50%, #f6f6f6 0%, #7cc1c4 100%)",
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
        ".satoshi-light": {
          fontWeight: "100",
          fontStyle: "normal",
        },
        ".satoshi-medium": {
          fontWeight: "300",
          fontStyle: "normal",
        },
        ".satoshi-regular": {
          fontWeight: "400",
          fontStyle: "normal",
        },
        ".satoshi-bold": {
          fontWeight: "500",
          fontStyle: "normal",
        },
        ".satoshi-black": {
          fontWeight: "700",
          fontStyle: "normal",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
