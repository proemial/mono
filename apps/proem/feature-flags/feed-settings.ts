import { unstable_flag as flag } from "@vercel/flags/next";

export const feedSettings = flag({
	key: "feedSettings",
	decide: () => ({
		showInstitutions: false,
	}),
});
