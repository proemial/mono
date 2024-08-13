import * as brands from "@proemial/repositories/oa/institutions/branding.json";
import { getRandomThemeColor, Theme } from "./color-theme";

export type Branding = {
	logo?: {
		url?: string;
		whiteOnBlack?: boolean;
	};
	theme: Theme;
};

export function brandingForInstitution(institution: string) {
	const sanitized = decodeURI(institution).toLowerCase();

	if (!Object.keys(brands).includes(sanitized)) {
		console.log("No branding found for", sanitized);

		return { theme: getRandomThemeColor(sanitized) };
	}

	const branding = brands[sanitized as keyof typeof brands] as Branding;

	if (!branding.theme) {
		console.log("No theme found for", sanitized);
		return { ...branding, theme: getRandomThemeColor(sanitized) };
	}

	return branding;
}
