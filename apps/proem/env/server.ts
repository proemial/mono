import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
	server: {
		ANTHROPIC_API_KEY: z.string().optional(),
		CLERK_SECRET_KEY: z.string(),
		DATABASE_URL: z.string(),
		GOOGLE_VERTEX_CLIENT_EMAIL: z.string().optional(),
		GOOGLE_VERTEX_LOCATION: z.string().optional(),
		GOOGLE_VERTEX_PRIVATE_KEY: z.string().optional(),
		GOOGLE_VERTEX_PROJECT: z.string().optional(),
		INNGEST_EVENT_KEY: z.string(),
		INNGEST_SIGNING_KEY: z.string(),
		LANGCHAIN_API_KEY: z.string(),
		LANGCHAIN_ENDPOINT: z.string(),
		LANGCHAIN_PROJECT: z.string(),
		LANGCHAIN_TEST_API_KEY: z.string(),
		LANGCHAIN_TRACING_V2: z.string(),
		OPENAI_API_KEY_TEST: z.string().optional(), // This is only used for evaluation but the code is build and running in production
		OPENAI_API_KEY: z.string(),
		OPENALEX_API_KEY: z.string(),
		RATE_LIMITER_ENDPOINT: z.string(),
		RATE_LIMITER_PASSWORD: z.string(),
		REDIS_PAPERS_TOKEN: z.string(),
		REDIS_PAPERS_URL: z.string(),
		REDIS_PAPERS_NEW_TOKEN: z.string(),
		REDIS_PAPERS_NEW_URL: z.string(),
		SENTRY_AUTH_TOKEN: z.string(),
		SENTRY_ORG: z.string(),
	},
	extends: [vercel()],
	isServer: typeof window === "undefined",
	experimental__runtimeEnv: process.env,
});
