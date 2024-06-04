import { relations, sql } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { collectionsToUsers } from "./collections-to-users";
import { comments } from "./comments";
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
	collectionsToUsers: many(collectionsToUsers),
	posts: many(posts),
	comments: many(comments),
}));
