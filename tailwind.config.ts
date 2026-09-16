import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#070B14",
          surface: "#0D1320",
          elevated: "#131B2B",
        },
        brand: {
          primary: "#35D6FF",
          cyan: "#35D6FF",
          blue: "#1687FF",
          violet: "#7C5CFF",
        },
        txt: {
          primary: "#F4F7FB",
          secondary: "#9AA7BA",
          muted: "#667085",
        },
        border: {
          subtle: "#202B3D",
          neo: "#26354D",
        },
        shadow: {
          hard: "#020409",
        },
        status: {
          success: "#35D07F",
          warning: "#FFB84D",
          error: "#FF5C6C",
        },
      },
      fontFamily: {
        sans: [
          "'Space Grotesk'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        neo: "4px 4px 0px #020409",
        "neo-sm": "2px 2px 0px #020409",
        "neo-brand": "4px 4px 0px rgba(53, 214, 255, 0.4)",
        "neo-cyan": "4px 4px 0px rgba(53, 214, 255, 0.4)",
        "neo-blue": "4px 4px 0px rgba(22, 135, 255, 0.4)",
        "neo-violet": "4px 4px 0px rgba(124, 92, 255, 0.4)",
        "neo-success": "4px 4px 0px rgba(53, 208, 127, 0.4)",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
