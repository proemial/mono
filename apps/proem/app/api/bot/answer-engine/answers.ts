import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import {
  answersTable,
  Answer,
  NewAnswer,
} from "@proemial/data/neon/schema/answersTable";
import { prettySlug } from "@/app/api/bot/answer-engine/prettySlug";

export const answers = {
  create(answer: NewAnswer) {
    const shareId = prettySlug(answer.answer);
    return neonDb.insert(answersTable).values({ ...answer, shareId });
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
};
