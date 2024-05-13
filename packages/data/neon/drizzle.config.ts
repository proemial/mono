import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
// TODO! currently tightly coupled with apps/proem
dotenv.config({ path: "../../apps/proem/.env.local" });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export default {
	schema: "./neon/schema/*",
	out: "./neon/drizzle",
	/**
	 * For postgresql dialect, Drizzle will:
	 * - Check if the pg driver is installed and use it.
	 * - If not, try to find the postgres driver and use it.
	 * - If still not found, try to find @vercel/postgres.
	 * - Then try @neondatabase/serverless.
	 * - If nothing is found, an error will be thrown.
	 */
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
} satisfies Config;
