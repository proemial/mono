import * as brands from "@proemial/repositories/oa/institutions/branding.json";
import { getRandomTheme, Theme } from "./color-theme";
import { get } from "http";

export type Branding = {
	logo?: {
		url?: string;
		whiteOnBlack?: boolean;
	};
	theme: Theme;
};

export function brandingForInstitution(institution: string) {
	const sanitized = decodeURI(institution).toLowerCase();

	const template = { theme: getRandomTheme(sanitized) };
	const branding = brands[sanitized as keyof typeof brands] as Branding;

	if (!branding) {
		return template;
	}

	return {
		theme: {
			...template.theme,
			...branding.theme,
		},
		logo: branding.logo,
	};
}
