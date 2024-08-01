import React from "react";
type SetThemeColorProps = {
	color: string;
};

export function SetThemeColor({ color }: SetThemeColorProps) {
	return (
		<>
			<meta name="theme-color" content={color} />
			<style>{`
        :root {
          --theme-50: var(--color-${color}-50);
          --theme-100: var(--color-${color}-100);
          --theme-200: var(--color-${color}-200);
          --theme-300: var(--color-${color}-300);
          --theme-400: var(--color-${color}-400);
          --theme-500: var(--color-${color}-500);
          --theme-600: var(--color-${color}-600);
          --theme-700: var(--color-${color}-700);
          --theme-800: var(--color-${color}-800);
          --theme-900: var(--color-${color}-900);
          --theme-950: var(--color-${color}-950);
        }
      `}</style>
		</>
	);
}
