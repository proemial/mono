import { unstable_flag as flag } from "@vercel/flags/next";

export const getDebugFlags = flag({
	key: "debug",
	decide: () => [false, false, false],
});
