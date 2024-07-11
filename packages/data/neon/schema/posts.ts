import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { collectionSharedType } from "./collections";
import { comments } from "./comments";
import { papers } from "./papers";
import { users } from "./users";

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	content: text("content").notNull(),
	authorId: text("author_id").notNull(),
	paperId: text("paper_id").notNull(),
	shared: collectionSharedType("shared").notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	paper: one(papers, {
		fields: [posts.paperId],
		references: [papers.id],
	}),
	comments: many(comments),
}));
