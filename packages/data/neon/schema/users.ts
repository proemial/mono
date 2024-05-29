import { relations, sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { comments } from "./comments";
import { posts } from "./posts";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
	bookmarks: many(bookmarks),
	posts: many(posts),
	comments: many(comments),
}));
