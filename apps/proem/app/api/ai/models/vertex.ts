import { createVertex } from "@ai-sdk/google-vertex";

export const vertex = createVertex({
	googleAuthOptions: {
		credentials: {
			client_email: process.env.GOOGLE_VERTEX_CLIENT_EMAIL,
			private_key: process.env.GOOGLE_VERTEX_PRIVATE_KEY,
		},
	},
});
