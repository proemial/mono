import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
// TODO! currently tightly coupled with apps/proem
dotenv.config({ path: "../../apps/proem/.env.local" });

export default {
  schema: "./neon/schema/*",
  out: "./neon/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL!}?sslmode=require`,
  },
} satisfies Config;
