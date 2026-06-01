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
        bg: {
          DEFAULT: "var(--bg)",
          deep: "var(--bg-deep)",
          card: "var(--bg-card)",
        },
        paper: "var(--paper)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        charcoal: "var(--charcoal)",
        dim: "var(--dim)",
        mute: "var(--mute)",
        hair: {
          DEFAULT: "var(--hair)",
          strong: "var(--hair-strong)",
        },
      },
      backgroundImage: {
        heat: "var(--heat)",
        "heat-h": "var(--heat-h)",
        "heat-deep": "var(--heat-deep)",
        "heat-radial": "var(--heat-radial)",
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
        container: "1340px",
      },
    },
  },
  plugins: [],
};

export default config;
