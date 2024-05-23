import { pgTable, text } from "drizzle-orm/pg-core";

export const papers = pgTable("papers", {
	id: text("id").primaryKey(),
	paperArt: text("paper_art"),
});
