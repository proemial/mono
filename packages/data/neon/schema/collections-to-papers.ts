import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { collections } from "./collections";
import { papers } from "./papers";

export const collectionsToPapers = pgTable(
	"collections_to_papers",
	{
		collectionsId: integer("collection_id")
			.notNull()
			.references(() => collections.id),
		paperId: text("paper_id")
			.notNull()
			.references(() => papers.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.collectionsId, t.paperId] }),
	}),
);

export const collectionsToPapersRelations = relations(
	collectionsToPapers,
	({ one }) => ({
		collection: one(collections, {
			fields: [collectionsToPapers.collectionsId],
			references: [collections.id],
		}),
		paper: one(papers, {
			fields: [collectionsToPapers.paperId],
			references: [papers.id],
		}),
	}),
);
