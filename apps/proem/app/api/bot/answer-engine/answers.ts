import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import {
  answersTable,
  Answer,
  NewAnswer,
} from "@proemial/data/neon/schema/answers";

export const answers = {
  create(answer: NewAnswer) {
    return neonDb.insert(answersTable).values(answer);
  },

  getBySlug(slug: Answer["slug"]) {
    return neonDb
      .select()
      .from(answersTable)
      .where(eq(answersTable.slug, slug));
  },
};
