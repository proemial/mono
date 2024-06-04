import { papers } from "@/neon/schema/papers";
import { users } from "@/neon/schema/users";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
	id: text("id").primaryKey(),
	name: text("name"),
	description: text("description"),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

// export const collectionRelations = relations(collections, ({ many }) => ({
// 	collectionsToUsers: many(collectionsToUsers),
// 	// collectionsToPapers: many(collectionsToPapers),
// }));

// export const collectionsToUsers = pgTable(
// 	"collections_to_users",
// 	{
// 		collectionId: text("collection_id")
// 			.notNull()
// 			.references(() => collections.id),
// 		userId: text("user_id")
// 			.notNull()
// 			.references(() => users.id),
// 	},
// 	(t) => ({
// 		pk: primaryKey({ columns: [t.userId, t.collectionId] }),
// 	}),
// );

// export const collectionsToUsersRelations = relations(
// 	collectionsToUsers,
// 	({ one }) => ({
// 		collection: one(collections, {
// 			fields: [collectionsToUsers.collectionId],
// 			references: [collections.id],
// 		}),
// 		user: one(users, {
// 			fields: [collectionsToUsers.userId],
// 			references: [users.id],
// 		}),
// 	}),
// );

// export const collectionsToPapers = pgTable(
// 	"collections_to_papers",
// 	{
// 		collectionsId: text("collection_id")
// 			.notNull()
// 			.references(() => collections.id),
// 		paperId: text("paper_id")
// 			.notNull()
// 			.references(() => papers.id),
// 	},
// 	(t) => ({
// 		pk: primaryKey({ columns: [t.collectionsId, t.paperId] }),
// 	}),
// );

// export const collectionsToPapersRelations = relations(
// 	collectionsToPapers,
// 	({ one }) => ({
// 		collection: one(collections, {
// 			fields: [collectionsToPapers.collectionsId],
// 			references: [collections.id],
// 		}),
// 		paper: one(papers, {
// 			fields: [collectionsToPapers.paperId],
// 			references: [papers.id],
// 		}),
// 	}),
// );
