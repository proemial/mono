import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const comments = pgTable("comments", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	authorId: text("author_id").notNull(),
	postId: integer("post_id").notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
}));
