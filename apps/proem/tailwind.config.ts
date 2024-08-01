import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const customColorTheme = {
	purple: {
		50: "var(--color-purple-50)",
		100: "var(--color-purple-100)",
		200: "var(--color-purple-200)",
		300: "var(--color-purple-300)",
		400: "var(--color-purple-400)",
		500: "var(--color-purple-500)",
		600: "var(--color-purple-600)",
		700: "var(--color-purple-700)",
		800: "var(--color-purple-800)",
		900: "var(--color-purple-900)",
		950: "var(--color-purple-950)",
	},
	teal: {
		50: "var(--color-teal-50)",
		100: "var(--color-teal-100)",
		200: "var(--color-teal-200)",
		300: "var(--color-teal-300)",
		400: "var(--color-teal-400)",
		500: "var(--color-teal-500)",
		600: "var(--color-teal-600)",
		700: "var(--color-teal-700)",
		800: "var(--color-teal-800)",
		900: "var(--color-teal-900)",
		950: "var(--color-teal-950)",
	},
	green: {
		50: "var(--color-green-50)",
		100: "var(--color-green-100)",
		200: "var(--color-green-200)",
		300: "var(--color-green-300)",
		400: "var(--color-green-400)",
		500: "var(--color-green-500)",
		600: "var(--color-green-600)",
		700: "var(--color-green-700)",
		800: "var(--color-green-800)",
		900: "var(--color-green-900)",
		950: "var(--color-green-950)",
	},
	rose: {
		50: "var(--color-rose-50)",
		100: "var(--color-rose-100)",
		200: "var(--color-rose-200)",
		300: "var(--color-rose-300)",
		400: "var(--color-rose-400)",
		500: "var(--color-rose-500)",
		600: "var(--color-rose-600)",
		700: "var(--color-rose-700)",
		800: "var(--color-rose-800)",
		900: "var(--color-rose-900)",
		950: "var(--color-rose-950)",
	},
	gold: {
		50: "var(--color-gold-50)",
		100: "var(--color-gold-100)",
		200: "var(--color-gold-200)",
		300: "var(--color-gold-300)",
		400: "var(--color-gold-400)",
		500: "var(--color-gold-500)",
		600: "var(--color-gold-600)",
		700: "var(--color-gold-700)",
		800: "var(--color-gold-800)",
		900: "var(--color-gold-900)",
		950: "var(--color-gold-950)",
	},
	theme: {
		50: "var(--theme-50)",
		100: "var(--theme-100)",
		200: "var(--theme-200)",
		300: "var(--theme-300)",
		400: "var(--theme-400)",
		500: "var(--theme-500)",
		600: "var(--theme-600)",
		700: "var(--theme-700)",
		800: "var(--theme-800)",
		900: "var(--theme-900)",
		950: "var(--theme-950)",
	},
};

const config = {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"../../packages/shadcn-ui/components/ui/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "var(--background)",
				foreground: "var(--foreground)",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
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
				...customColorTheme,
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			fontSize: {
				"2xs": "0.563rem",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;
