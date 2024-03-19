import { z } from "zod";

export const envVariables = z.object({
	ANTHROPIC_API_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	DATABASE_URL: z.string(),
	GROQ_API_KEY: z.string(),
	LANGCHAIN_API_KEY: z.string(),
	LANGCHAIN_ENDPOINT: z.string(),
	LANGCHAIN_PROJECT: z.string(),
	LANGCHAIN_TEST_API_KEY: z.string(),
	LANGCHAIN_TRACING_V2: z.string(),
	MISTRAL_API_KEY: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_GA_ID: z.string(),
	NEXT_PUBLIC_POSTHOG_HOST: z.string(),
	NEXT_PUBLIC_POSTHOG_KEY: z.string(),
	NEXT_PUBLIC_SENTRY_DSN: z.string(),
	OPENAI_API_KEY_TEST: z.string(),
	OPENAI_API_KEY: z.string(),
	OPENALEX_API_KEY: z.string(),
	SENTRY_ORG: z.string(), // not used
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}
