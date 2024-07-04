import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "../../lib/create-id";
import { collectionsToPapers } from "./collections-to-papers";

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
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const collectionRelations = relations(collections, ({ many }) => ({
	collectionsToPapers: many(collectionsToPapers),
}));
