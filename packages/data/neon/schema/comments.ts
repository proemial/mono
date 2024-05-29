import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const comments = pgTable("comments", {
	id: serial("id").primaryKey(),
	content: text("content"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	authorId: text("author_id"),
	postId: integer("post_id"),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
}));
