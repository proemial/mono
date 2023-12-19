import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: "apps/proem/.env.local" });

export default {
  schema: "packages/database/schema/*",
  out: "packages/database/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL!}?sslmode=require`,
  },
} satisfies Config;
