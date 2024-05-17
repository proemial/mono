import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { papers } from "./papers";
import { users } from "./users";

export const bookmarks = pgTable(
	"bookmarks",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		paperId: text("paper_id")
			.notNull()
			.references(() => papers.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.paperId] }),
	}),
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	paper: one(papers, {
		fields: [bookmarks.paperId],
		references: [papers.id],
	}),
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id],
	}),
}));

export type Bookmark = typeof bookmarks.$inferSelect;
