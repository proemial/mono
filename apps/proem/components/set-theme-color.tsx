import React from "react";
type SetThemeColorProps = {
	color: string;
};

export function SetThemeColor({ color }: SetThemeColorProps) {
	return (
		<>
			<meta name="theme-color" content={color} />
		</>
	);
}
