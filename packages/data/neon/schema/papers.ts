import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { collectionsToPapers } from "./collections-to-papers";
import { paperReads } from "./paper-reads";
import { posts } from "./posts";

export const papers = pgTable("papers", {
	id: text("id").primaryKey(),
});

export type Paper = typeof papers.$inferSelect;
export type NewPaper = typeof papers.$inferInsert;

export const papersRelations = relations(papers, ({ many }) => ({
	bookmarks: many(bookmarks),
	posts: many(posts),
	collectionsToPapers: many(collectionsToPapers),
	paper_reads: many(paperReads),
}));
