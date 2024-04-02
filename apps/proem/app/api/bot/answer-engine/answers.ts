import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";
import { neonDb } from "@proemial/data";
import {
	type Answer,
	type NewAnswer,
	answersTable,
} from "@proemial/data/neon/schema/answersTable";
import { eq } from "drizzle-orm";

export const answers = {
	async create(answer: NewAnswer) {
		const shareId = prettySlug(answer.answer);
		const [insertedAnswer] = await neonDb
			.insert(answersTable)
			.values({ ...answer, shareId })
			.returning();
		return insertedAnswer;
	},

	getByShareId(shareId: NonNullable<Answer["shareId"]>) {
		return neonDb
			.select()
			.from(answersTable)
			.where(eq(answersTable.shareId, shareId));
	},

	getBySlug(slug: Answer["slug"]) {
		return neonDb
			.select()
			.from(answersTable)
			.where(eq(answersTable.slug, slug));
	},

	getStarters() {
		return neonDb.select().from(answersTable).limit(10);
	},
};
