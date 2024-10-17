import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ZodSchema } from "zod";
import { createId } from "../../utils/create-id";
import { collectionsToPapers } from "./collections-to-papers";
import { collectionSharedType, posts } from "./posts";

export const collections = pgTable("collections", {
	id: text("id")
		.notNull()
		.$defaultFn(() => createId("collection"))
		.primaryKey(),
	slug: text("slug")
		.notNull()
		.unique()
		.$defaultFn(() => createId()),
	ownerId: text("owner_id").notNull(),
	orgId: text("org_id"),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
	shared: collectionSharedType("shared").notNull().default("private"),
	slug0: text("slug0"),
	slug1: text("slug1"),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const collectionRelations = relations(collections, ({ many }) => ({
	collectionsToPapers: many(collectionsToPapers),
	posts: many(posts),
}));

// @ts-ignore
export const CollectionSchema = createInsertSchema(collections, {
	name: (schema) => schema.name.min(1).max(50),
	description: (schema) => schema.description.max(200),
}) as ZodSchema<NewCollection>;
