import { Inngest } from "inngest";

// Run in development:
// 1. Uncomment baseUrl
// 2. Run `npx inngest-cli@latest dev --no-discovery -u http://127.0.0.1:4242/api/inngest`

export const inngest = new Inngest({
	id: "proem",
	// baseUrl: "http://localhost:8288",
});
