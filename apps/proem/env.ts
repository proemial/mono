import { z } from "zod";

export const envVariables = z.object({
	ANTHROPIC_API_KEY: z.string().optional(), //TODO!
	CLERK_SECRET_KEY: z.string(),
	DATABASE_URL: z.string(),
	GOOGLE_VERTEX_CLIENT_EMAIL: z.string().optional(), //TODO!
	GOOGLE_VERTEX_LOCATION: z.string().optional(), //TODO!
	GOOGLE_VERTEX_PRIVATE_KEY: z.string().optional(), //TODO!
	GOOGLE_VERTEX_PROJECT: z.string().optional(), //TODO!
	INNGEST_EVENT_KEY: z.string(),
	INNGEST_SIGNING_KEY: z.string(),
	LANGCHAIN_API_KEY: z.string(),
	LANGCHAIN_ENDPOINT: z.string(),
	LANGCHAIN_PROJECT: z.string(),
	LANGCHAIN_TEST_API_KEY: z.string(),
	LANGCHAIN_TRACING_V2: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_GA_ID: z.string(),
	NEXT_PUBLIC_POSTHOG_HOST: z.string(),
	NEXT_PUBLIC_POSTHOG_KEY: z.string(),
	NEXT_PUBLIC_SENTRY_DSN: z.string(),
	NEXT_PUBLIC_VERCEL_URL: z.string(),
	OPENAI_API_KEY_TEST: z.string().optional(), // This is only used for evaluation but the code is build and running in production
	OPENAI_API_KEY: z.string(),
	OPENALEX_API_KEY: z.string(),
	RATE_LIMITER_ENDPOINT: z.string(),
	RATE_LIMITER_PASSWORD: z.string(),
	REDIS_PAPERS_TOKEN: z.string(),
	REDIS_PAPERS_URL: z.string(),
	SENTRY_AUTH_TOKEN: z.string(),
	SENTRY_ORG: z.string(),
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}
