import { env } from "@/env/server";
import { createVertex } from "@ai-sdk/google-vertex";

export const vertex = createVertex({
	googleAuthOptions: {
		credentials: {
			client_email: env.GOOGLE_VERTEX_CLIENT_EMAIL,
			private_key: env.GOOGLE_VERTEX_PRIVATE_KEY,
		},
	},
});
