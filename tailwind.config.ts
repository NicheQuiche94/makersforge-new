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
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        ink: "var(--ink)",
        dim: "var(--dim)",
        mute: "var(--mute)",
        orange: "var(--orange)",
        hair: {
          DEFAULT: "var(--hair)",
          strong: "var(--hair-strong)",
        },
      },
      backgroundImage: {
        heat: "var(--heat)",
        "heat-text": "var(--heat-text)",
      },
      fontFamily: {
        display: ['"Cal Sans"', "system-ui", "sans-serif"],
        sans: ["var(--font-figtree)", '"Figtree"', "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      borderRadius: {
        pill: "999px",
      },
      maxWidth: {
        container: "1320px",
        nav: "1340px",
      },
    },
  },
  plugins: [],
};

export default config;
