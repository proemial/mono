import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { collections } from "./collections";
import { users } from "./users";

export const collectionsToUsers = pgTable(
	"collections_to_users",
	{
		collectionId: text("collection_id")
			.notNull()
			.references(() => collections.id),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.collectionId] }),
	}),
);

export const collectionsToUsersRelations = relations(
	collectionsToUsers,
	({ one }) => ({
		collection: one(collections, {
			fields: [collectionsToUsers.collectionId],
			references: [collections.id],
		}),
		user: one(users, {
			fields: [collectionsToUsers.userId],
			references: [users.id],
		}),
	}),
);
