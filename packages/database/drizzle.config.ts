import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
// TODO! currently tightly coupled with apps/proem
dotenv.config({ path: "../../apps/proem/.env.local" });

export default {
  schema: "./schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env.DATABASE_URL!}?sslmode=require`,
  },
} satisfies Config;
