import { neonDb } from "..";
import { papers } from "../neon/schema";

export async function ensurePaperExistsInDb(paperId: string) {
	await neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing();
}
