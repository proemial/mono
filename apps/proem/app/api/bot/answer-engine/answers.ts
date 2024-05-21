import { prettySlug } from '@/app/api/bot/answer-engine/prettySlug';
import { neonDb } from '@proemial/data';
import {
  type Answer,
  type NewAnswer,
  answers as answersTable,
} from '@proemial/data/neon/schema/answers';
import { desc, eq } from 'drizzle-orm';

export const answers = {
  async create(answer: NewAnswer) {
    const shareId = prettySlug(answer.answer);
    const [insertedAnswer] = await neonDb
      .insert(answersTable)
      .values({ ...answer, shareId })
      .returning();
    return insertedAnswer;
  },

  getByShareId(shareId: NonNullable<Answer['shareId']>) {
    return neonDb
      .select()
      .from(answersTable)
      .where(eq(answersTable.shareId, shareId));
  },

  getBySlug(slug: Answer['slug']) {
    return neonDb
      .select()
      .from(answersTable)
      .where(eq(answersTable.slug, slug));
  },

  getByUserId(userId: NonNullable<Answer['ownerId']>) {
    return neonDb
      .selectDistinctOn([answersTable.shareId])
      .from(answersTable)
      .where(eq(answersTable.ownerId, userId))
      .orderBy(answersTable.shareId, desc(answersTable.createdAt))
      .limit(10);
  },

  getStarters() {
    return neonDb
      .select()
      .from(answersTable)
      .where(eq(answersTable.isStarterQuestion, true));
  },

  addAsStarter(shareId: NonNullable<Answer['shareId']>) {
    return neonDb
      .update(answersTable)
      .set({ isStarterQuestion: true })
      .where(eq(answersTable.shareId, shareId))
      .returning();
  },

  update(answerId: Answer['id'], updatedAnswer: Partial<Answer>) {
    return neonDb
      .update(answersTable)
      .set(updatedAnswer)
      .where(eq(answersTable.id, answerId))
      .returning();
  },

  removeAsStarter(answerId: Answer['id']) {
    return neonDb
      .update(answersTable)
      .set({ isStarterQuestion: false })
      .where(eq(answersTable.id, answerId))
      .returning();
  },
};
