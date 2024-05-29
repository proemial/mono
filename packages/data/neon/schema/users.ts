import { relations, sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { posts } from "./posts";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
});

export const usersRelations = relations(users, ({ many }) => ({
	bookmarks: many(bookmarks),
	posts: many(posts),
}));
