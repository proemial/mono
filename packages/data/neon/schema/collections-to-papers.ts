import { relations } from "drizzle-orm";
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { collections } from "./collections";
import { papers } from "./papers";

export const collectionsToPapers = pgTable(
	"collections_to_papers",
	{
		collectionsId: text("collection_id")
			.notNull()
			.references(() => collections.id),
		paperId: text("paper_id")
			.notNull()
			.references(() => papers.id),
		isEnabled: boolean("is_enabled").notNull().default(true),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
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
