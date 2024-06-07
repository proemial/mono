import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { collectionsToPapers } from "./collections-to-papers";
import { collectionsToUsers } from "./collections-to-users";

export const collections = pgTable("collections", {
	id: text("id").primaryKey(),
	ownerId: text("owner_id").notNull(),
	name: text("name"),
	description: text("description"),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const collectionRelations = relations(collections, ({ many }) => ({
	collectionsToUsers: many(collectionsToUsers),
	collectionsToPapers: many(collectionsToPapers),
}));
