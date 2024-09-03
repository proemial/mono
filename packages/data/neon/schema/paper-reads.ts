import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { papers } from "./papers";
import { users } from "./users";

export type PaperRead = typeof paperReads.$inferSelect;
export type NewPaperRead = typeof paperReads.$inferInsert;
export type FindPaperRead = Pick<PaperRead, "userId" | "paperId">;

export const paperReads = pgTable(
	"paper_reads",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		paperId: text("paper_id")
			.notNull()
			.references(() => papers.id),
		lastReadAt: timestamp("last_read_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		readCount: integer("read_count").notNull().default(1),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.paperId] }),
	}),
);

export const paperReadsRelations = relations(paperReads, ({ one }) => ({
	user: one(users, {
		fields: [paperReads.userId],
		references: [users.id],
	}),
	paper: one(papers, {
		fields: [paperReads.paperId],
		references: [papers.id],
	}),
}));
