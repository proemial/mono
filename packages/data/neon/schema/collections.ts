import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ZodSchema } from "zod";
import { createId } from "../../utils/create-id";
import { collectionsToPapers } from "./collections-to-papers";

export const collectionSharedType = pgEnum("shared", [
	"private",
	"organization",
	"public",
]);

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
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const collectionRelations = relations(collections, ({ many }) => ({
	collectionsToPapers: many(collectionsToPapers),
}));

// @ts-ignore
export const CollectionSchema = createInsertSchema(collections, {
	name: (schema) => schema.name.min(1).max(50),
	description: (schema) => schema.description.max(200),
}) as ZodSchema<NewCollection>;
