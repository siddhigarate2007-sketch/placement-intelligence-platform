import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#080D19",
          secondary: "#0C1424",
          glass: "rgba(17, 28, 50, 0.65)",
          glassHover: "rgba(22, 36, 64, 0.80)",
        },
        primary: {
          violet: "#7565F6",
          indigo: "#A5B4FC",
          cyan: "#22D3EE",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          error: "#FB7185",
        },
      },
      backdropBlur: {
        xs: "4px",
        glass: "22px",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.12)",
        "glass-light": "rgba(255, 255, 255, 0.16)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-violet": "0 0 25px -5px rgba(117, 101, 246, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(34, 211, 238, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
