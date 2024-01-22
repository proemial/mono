import { json, jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const papers = pgTable("papers", {
  data: json("data"),
  id: text("id").notNull().primaryKey(),
  // TODO! add starters?
  generated: json("generated").default({ title: null }),
});
