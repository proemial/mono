import { prettySlug } from "@proemial/utils/pretty-slug";
import { desc, eq } from "drizzle-orm";
import { neonDb } from "..";
import {
	type Answer,
	type NewAnswer,
	answers as answersTable,
} from "../neon/schema/answers";

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

	getByUserId(userId: NonNullable<Answer["ownerId"]>) {
		return neonDb
			.select({
				id: answersTable.id,
				question: answersTable.question,
				slug: answersTable.slug,
				createdAt: answersTable.createdAt,
			})
			.from(answersTable)
			.where(eq(answersTable.ownerId, userId))
			.orderBy(desc(answersTable.createdAt));
	},

	get10LatestByUserId(userId: NonNullable<Answer["ownerId"]>) {
		return neonDb
			.select()
			.from(answersTable)
			.where(eq(answersTable.ownerId, userId))
			.orderBy(desc(answersTable.createdAt))
			.limit(10);
	},

	getStarters() {
		return neonDb
			.select()
			.from(answersTable)
			.where(eq(answersTable.isStarterQuestion, true));
	},

	addAsStarter(shareId: NonNullable<Answer["shareId"]>) {
		return neonDb
			.update(answersTable)
			.set({ isStarterQuestion: true })
			.where(eq(answersTable.shareId, shareId))
			.returning();
	},

	update(answerId: Answer["id"], updatedAnswer: Partial<Answer>) {
		return neonDb
			.update(answersTable)
			.set(updatedAnswer)
			.where(eq(answersTable.id, answerId))
			.returning();
	},

	removeAsStarter(answerId: Answer["id"]) {
		return neonDb
			.update(answersTable)
			.set({ isStarterQuestion: false })
			.where(eq(answersTable.id, answerId))
			.returning();
	},
};
