"use server";

import { neonDb } from "@proemial/data";
import { bookmarks, papers, users } from "@proemial/data/neon/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const bookmarkPaperParams = z.object({
	userId: z.string().optional(),
	paperId: z.string(),
});

// TODO: Auth and rate limit

export async function getPaperBookmark(
	params: z.infer<typeof bookmarkPaperParams>,
) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return false;
	}
	const bookmark = await neonDb.query.bookmarks.findFirst({
		where: and(eq(bookmarks.paperId, paperId), eq(bookmarks.userId, userId)),
	});
	return !!bookmark;
}

export async function addPaperBookmark(
	params: z.infer<typeof bookmarkPaperParams>,
) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return;
	}
	await Promise.all([
		neonDb.insert(users).values({ id: userId }).onConflictDoNothing(),
		neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing(),
	]);
	await neonDb
		.insert(bookmarks)
		.values({ userId, paperId })
		.onConflictDoNothing();
}

export async function removePaperBookmark(
	params: z.infer<typeof bookmarkPaperParams>,
) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return;
	}
	await neonDb
		.delete(bookmarks)
		.where(and(eq(bookmarks.paperId, paperId), eq(bookmarks.userId, userId)));
}
