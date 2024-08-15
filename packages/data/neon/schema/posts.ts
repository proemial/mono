import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { collections } from "./collections";
import { comments } from "./comments";
import { papers } from "./papers";
import { users } from "./users";

export const collectionSharedType = pgEnum("shared", [
	"private",
	"organization",
	"public",
]);

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	content: text("content").notNull(),
	authorId: text("author_id").notNull(),
	spaceId: text("space_id"),
	shared: collectionSharedType("shared").notNull(),
	paperId: text("paper_id"),
	slug: text("slug"), // TODO: Add non-null constraint once migrated
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	space: one(collections, {
		fields: [posts.spaceId],
		references: [collections.id],
	}),
	paper: one(papers, {
		fields: [posts.paperId],
		references: [papers.id],
	}),
	comments: many(comments),
}));
