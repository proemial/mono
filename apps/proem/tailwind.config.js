const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // https://www.hyperui.dev/blog/text-shadow-with-tailwindcss
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 6px #000000",
        shine: "0 2px 6px #000000,0 -1px 3px rgba(255,255,255,0.4)", // header title
        purple: "0 1px 4px #000000,0 -1px 6px rgba(255,102,255,0.5)", // header published
        purple2: "0 -1px 6px rgba(255,102,255,0.8)", // unliked tag
        purple3: "0 0 4px rgba(255,102,255,0.5)", // liked tag
        glow: "0 0 4px #FF66FF", // cards
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      boxShadow: {
        DEFAULT: "0 4px 8px hsl(var(--background))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          gradient: "hsl(var(--primary-gradient-end))",
          light: "hsl(var(--light-purple))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          gradient: "hsl(var(--secondary-gradient-end))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          disabled: "hsl(var(--muted-foreground-disabled))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        xxs: ["12px", { lineHeight: "20px", fontWeight: "500" }],
        xs: ["12px", { lineHeight: "24px", fontWeight: "500" }],
        sm: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        base: ["18px", { lineHeight: "28px", fontWeight: "500" }],
        xl: ["24px", { lineHeight: "24px", fontWeight: "500" }],
        "2xl": ["20px", { lineHeight: "24px", fontWeight: "500" }],
        "3xl": ["32px", { lineHeight: "40px", fontWeight: "500" }],
      },
      fontFamily: {
        sans: ['"Helvetica"', 'system-ui',],
        SourceCodePro: ['Source Code Pro'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
