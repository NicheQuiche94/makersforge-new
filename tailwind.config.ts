import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E8491F",
          "orange-dark": "#C93D18",
          "orange-light": "#F05A2F",
          black: "#0A0A0A",
          "black-light": "#111111",
          grey: "#1A1A1A",
          white: "#FFFFFF",
          "white-muted": "#A3A3A3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-cal-sans)", "'Cal Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;