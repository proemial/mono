import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const papers = pgTable("papers", {
  data: jsonb("data"),
  id: text("id").notNull().primaryKey(),
  // TODO! add starters?
  generated: jsonb("generated").default({ title: null }),
});
