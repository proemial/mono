import { numberFrom } from "@proemial/utils/string";

const themePatterns = ["silicon", "leafs", "paint", "fingerprint"] as const;
const themeColors = ["purple", "teal", "green", "rose", "gold"] as const;

export type ThemePatterns = (typeof themePatterns)[number];
export type ThemeColor = (typeof themeColors)[number];

export type Theme = {
	image?: ThemePatterns;
	color: ThemeColor;
};

export const DEFUALT_THEME_KEY = "theme" as const;
type DefaultThemeKey = typeof DEFUALT_THEME_KEY;

export const generateColorTheme = (
	themeColor: ThemeColor | DefaultThemeKey,
) => {
	return {
		50: `rgb(var(--color-${themeColor}-50) / <alpha-value>)`,
		100: `rgb(var(--color-${themeColor}-100) / <alpha-value>)`,
		200: `rgb(var(--color-${themeColor}-200) / <alpha-value>)`,
		300: `rgb(var(--color-${themeColor}-300) / <alpha-value>)`,
		400: `rgb(var(--color-${themeColor}-400) / <alpha-value>)`,
		500: `rgb(var(--color-${themeColor}-500) / <alpha-value>)`,
		600: `rgb(var(--color-${themeColor}-600) / <alpha-value>)`,
		700: `rgb(var(--color-${themeColor}-700) / <alpha-value>)`,
		800: `rgb(var(--color-${themeColor}-800) / <alpha-value>)`,
		900: `rgb(var(--color-${themeColor}-900) / <alpha-value>)`,
		950: `rgb(var(--color-${themeColor}-950) / <alpha-value>)`,
	};
};

export const generateThemeCssVariables = (themeColor: ThemeColor) => {
	return `
	--color-theme-50: var(--color-${themeColor}-50);
  --color-theme-100:var(--color-${themeColor}-100);
  --color-theme-200: var(--color-${themeColor}-200);
  --color-theme-300: var(--color-${themeColor}-300);
  --color-theme-400: var(--color-${themeColor}-400);
  --color-theme-500: var(--color-${themeColor}-500);
  --color-theme-600: var(--color-${themeColor}-600);
  --color-theme-700: var(--color-${themeColor}-700);
  --color-theme-800: var(--color-${themeColor}-800);
  --color-theme-900: var(--color-${themeColor}-900);
  --color-theme-950: var(--color-${themeColor}-950);
	`;
};

export const getRandomThemeColor = (seed: string): Theme => {
	return {
		color: themeColors[numberFrom(seed, themeColors.length - 1)]!,
		image: themePatterns[numberFrom(seed, themePatterns.length - 1)]!,
	};
};

export const customColorTheme = {
	purple: generateColorTheme("purple"),
	teal: generateColorTheme("teal"),
	green: generateColorTheme("green"),
	rose: generateColorTheme("rose"),
	gold: generateColorTheme("gold"),
	theme: generateColorTheme(DEFUALT_THEME_KEY),
};

/**
 * Fallback colors for when the css variables are not available.
 */
export const customColorThemeStaticFallback = {
	purple: "rgb(160, 161, 182)",
	teal: "rgb(130, 161, 166)",
	green: "rgb(139, 185, 159)",
	rose: "rgb(173, 150, 162)",
	gold: "rgb(178, 166, 148)",
};
