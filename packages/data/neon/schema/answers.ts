import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  slug: text("slug").notNull(),
  // updatedAT | createdA
  // paperIds: integer("paperIds").array(),
});

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;

// export const answersRelations = relations(answers, ({ many }) => ({
//   paper: many(papers),
// }));
