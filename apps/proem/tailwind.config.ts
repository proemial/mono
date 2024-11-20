import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { customColorTheme } from "./app/theme/color-theme";

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
			screens: {
				xs: "480px",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "rgb(var(--background))",
				foreground: "rgb(var(--foreground))",
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
				"slide-down": {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0)" },
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"slide-down": "slide-down 0.5s ease-out",
				"fade-in": "fade-in 0.5s ease-in-out",
			},
			fontSize: {
				"2xs": "0.625rem",
			},
		},
	},
	plugins: [require("tailwindcss-animate"),
        require("tailwind-scrollbar-hide"),
				require('@tailwindcss/typography'),
        (plugin: { addVariant: (name: string, value: string) => void }) => {
            plugin.addVariant('not-last-child', '&:not(:last-child)');
			plugin.addVariant('not-first-child', '&:not(:first-child)');
        }],
} satisfies Config;

export default config;
