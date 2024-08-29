import { unstable_flag as flag } from "@vercel/flags/next";

export const showAIAssistant = flag({
	key: "showAIAssistant",
	decide: () => true,
});
