import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const answersTable = pgTable("answers", {
	id: serial("id").notNull().primaryKey(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	slug: text("slug").notNull(),
	shareId: text("shareId"),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	ownerId: text("ownerId"),
	keyConcept: text("keyConcept"),
	relatedConcepts: text("relatedConcepts").array(),
	// TODO! This is all papers & we need to save the papers used for the answer separately
	papers:
		// TODO! infer from centralised paper schema?
		jsonb("papers").$type<{
			// TODO! Add date
			papers: { link: string; abstract: string; title: string }[];
		}>(),
});

export type Answer = typeof answersTable.$inferSelect;
export type NewAnswer = typeof answersTable.$inferInsert;
