import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { collectionsToPapers } from "./collections-to-papers";

export const collections = pgTable("collections", {
	id: serial("id").primaryKey(),
	slug: text("slug")
		.notNull()
		.unique()
		.$defaultFn(() => nanoid()),
	ownerId: text("owner_id").notNull(),
	name: text("name").notNull(),
	description: text("description"),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const collectionRelations = relations(collections, ({ many }) => ({
	collectionsToPapers: many(collectionsToPapers),
}));
