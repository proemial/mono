import {
	ThemeColor,
	customColorThemeStaticFallback,
	generateThemeCssVariables,
} from "@/app/theme/color-theme";

type SetThemeColorProps = {
	color: ThemeColor;
};

export function SetThemeColor({ color }: SetThemeColorProps) {
	const themeCssVariables = generateThemeCssVariables(color);
	const themeColor = customColorThemeStaticFallback[color];
	return (
		<>
			<meta name="theme-color" content={themeColor} />
			<style>{`
				:root {
					${themeCssVariables}
				}
			`}</style>
		</>
	);
}
