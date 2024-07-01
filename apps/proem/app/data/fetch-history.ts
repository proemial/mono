import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { PaperActivity, users } from "@proemial/data/neon/schema";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { getBookmarksByCollectionId } from "../(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";

// Max no. of papers from read history to use in filter
const MAX_COUNT = 30;

export async function getBookmarksAndHistory(
	user?: string,
): Promise<Array<string[]>> {
	const { userId } = auth();
	const uid = user ?? userId;

	if (uid) {
		const user = await neonDb.query.users.findFirst({
			where: eq(users.id, uid),
		});

		const bookmarks = uid ? await getBookmarksByCollectionId(uid) : {};
		const bookmarkIds = Object.keys(bookmarks);
		const readHistoryIds = sortAndFilter(user?.paperActivities ?? [])?.map(
			(paper) => paper.paperId,
		);

		return [bookmarkIds, readHistoryIds];
	}

	return [];
}

function sortAndFilter(readHistory: PaperActivity[]) {
	const maxCount = MAX_COUNT;

	const millis = (date: string) => dayjs(date).valueOf();

	const sortedHistory = readHistory
		?.sort((a, b) => millis(b.lastReadAt) - millis(a.lastReadAt))
		.sort((a, b) => b.noOfReads - a.noOfReads);

	return sortedHistory?.slice(0, maxCount);
}
