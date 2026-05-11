import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#121212",
        mist: "#f3f5f4",
        paper: "#f8f7f2",
        graphite: "#5a5f5d",
        press: "#d83a2e",
        cyan: "#0d8ea0",
        brass: "#b98416",
        steel: "#24323a"
      },
      boxShadow: {
        soft: "8px 8px 0 rgba(18, 18, 18, 0.10)",
        lift: "12px 12px 0 rgba(18, 18, 18, 0.12)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        serif: ["Georgia", "Times New Roman", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
