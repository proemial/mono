import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

export const answerEngineMemory = pgTable("answer-engine-memory", {
  id: serial("id").primaryKey(),
  sessionId: text("sessionId").notNull(),
  content: text("content").notNull(),
  name: text("name"),
  role: text("role"),
  type: text("type").notNull(),
  toolCallId: text("toolCallId"),
  additionalKwargs: text("additionalKwargs").notNull(),
  // updatedAT | createdA
  // paperIds: integer("paperIds").array(),
});

export type AnswerEngineMemory = typeof answerEngineMemory.$inferSelect;
export type NewAnswerEngineMemory = typeof answerEngineMemory.$inferInsert;

// export const answersRelations = relations(answers, ({ many }) => ({
//   paper: many(papers),
// }));
