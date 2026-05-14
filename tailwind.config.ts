import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        mist: "rgb(var(--mist-rgb) / <alpha-value>)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        graphite: "rgb(var(--graphite-rgb) / <alpha-value>)",
        press: "rgb(var(--press-rgb) / <alpha-value>)",
        cyan: "rgb(var(--cyan-rgb) / <alpha-value>)",
        brass: "rgb(var(--brass-rgb) / <alpha-value>)",
        steel: "rgb(var(--steel-rgb) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 18px 42px rgba(27, 28, 25, 0.08)",
        lift: "0 28px 68px rgba(27, 28, 25, 0.12)"
      },
      fontFamily: {
        sans: [
          "Manrope",
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
