import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";

export const papers = pgTable("papers", {
	id: text("id").primaryKey(),
});

export const papersRelations = relations(papers, ({ many }) => ({
	bookmarks: many(bookmarks),
}));

export type Paper = typeof papers.$inferSelect;
export type NewPaper = typeof papers.$inferInsert;
