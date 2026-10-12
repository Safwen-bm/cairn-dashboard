import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        sunken: token("sunken"),
        line: token("line"),
        ink: token("ink"),
        soft: token("soft"),
        faint: token("faint"),
        accent: token("accent"),
        "accent-fg": token("accent-fg"),
        moss: token("moss"),
        berry: token("berry"),
        ochre: token("ochre"),
        tide: token("tide"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgb(var(--line)), 0 1px 3px rgb(30 22 10 / 0.07)",
        lift: "0 18px 36px -12px rgb(30 22 10 / 0.35), 0 2px 6px rgb(30 22 10 / 0.12)",
      },
      keyframes: {
        pop: {
          from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        pop: "pop 180ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;