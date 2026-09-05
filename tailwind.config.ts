import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        page: "rgb(var(--color-page) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        raised: "rgb(var(--color-raised) / <alpha-value>)",
        edge: "rgb(var(--color-edge) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        "fg-2": "rgb(var(--color-fg-2) / <alpha-value>)",
        "fg-3": "rgb(var(--color-fg-3) / <alpha-value>)",
        "fg-4": "rgb(var(--color-fg-4) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
        "code-surface": "rgb(var(--code-surface) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
export default config;
