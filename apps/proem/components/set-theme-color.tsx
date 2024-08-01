import { ThemeColor, generateThemeCssVariables } from "@/app/theme/color-theme";
import React from "react";

type SetThemeColorProps = {
	color: ThemeColor;
};

export function SetThemeColor({ color }: SetThemeColorProps) {
	const themeCssVariables = generateThemeCssVariables(color);
	return (
		<>
			<meta name="theme-color" content={color} />
			<style>{`
				:root {
					${themeCssVariables}
				}
			`}</style>
		</>
	);
}
