import { relations, sql } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { comments } from "./comments";
import { paperReads } from "./paper-reads";
import { posts } from "./posts";

export type PaperActivity = {
	paperId: string;
	lastReadAt: string;
	noOfReads: number;
};

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
	paperActivities: jsonb("paper_activities")
		.$type<PaperActivity[]>()
		.notNull()
		.default([]),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
	bookmarks: many(bookmarks),
	posts: many(posts),
	comments: many(comments),
	paper_reads: many(paperReads),
}));
