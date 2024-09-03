import { unstable_flag as flag } from "@vercel/flags/next";

export const summariseModel = flag({
	key: "summariseModel",
	decide: () => "gpt-3.5-turbo" as "gpt-3.5-turbo" | "claude-3-haiku",
});
