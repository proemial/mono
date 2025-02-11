import { Inngest } from "inngest";
// Development:
// Run `npx inngest-cli@latest dev --no-discovery -u http://127.0.0.1:6262/api/inngest`

export const inngest = new Inngest({
	id: "assistant",
	baseUrl:
		process.env.NODE_ENV === "development"
			? "http://localhost:8288"
			: undefined,
});
