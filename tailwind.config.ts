import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#0F172A",
        fynavo: {
          dark: "#080C14",
          surface: "#0D1424",
          elevated: "#131D33",
          navy: "#0F172A",
          slate: "#1E293B",
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-light": "#EFF6FF",
          green: "#10B981",
          "green-light": "#ECFDF5",
          warning: "#F59E0B",
          "warning-light": "#FFFBEB",
          risk: "#EF4444",
          "risk-light": "#FEF2F2",
          purple: "#8B5CF6",
          "purple-light": "#F5F3FF",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "16px",
        premium: "20px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 4px 14px -2px rgba(15, 23, 42, 0.05)",
        "card-hover": "0 12px 28px -4px rgba(15, 23, 42, 0.09), 0 4px 10px -2px rgba(15, 23, 42, 0.03)",
        elevated: "0 20px 35px -8px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)",
        "glow-blue": "0 0 25px -4px rgba(37, 99, 235, 0.25)",
        "glow-emerald": "0 0 25px -4px rgba(16, 185, 129, 0.25)",
        "glow-purple": "0 0 25px -4px rgba(139, 92, 246, 0.25)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
      },
      keyframes: {
        radar: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        radar: "radar 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
