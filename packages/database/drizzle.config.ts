import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
// TODO! currently tightly coupled to proem, but how can we handle cross-app env vars with Vercel?
dotenv.config({ path: "../../apps/proem/.env.local" });

export default {
  schema: "./schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // TODO! handle type safe env vars
    connectionString: `${process.env.DATABASE_URL!}?sslmode=require`,
  },
} satisfies Config;
