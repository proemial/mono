import { auth } from "@clerk/nextjs/server";
import { PaperActivity, User } from "@proemial/data/neon/schema";
import dayjs from "dayjs";
import { getBookmarksByCollectionId } from "../(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { getUser } from "@proemial/data/repository/user";

// Max no. of papers from read history to use in filter
const MAX_COUNT = 30;

function sortAndFilter(readHistory: PaperActivity[]) {
	const maxCount = MAX_COUNT;

	const millis = (date: string) => dayjs(date).valueOf();

	const sortedHistory = [...readHistory]
		?.sort((a, b) => millis(b.lastReadAt) - millis(a.lastReadAt))
		.sort((a, b) => b.noOfReads - a.noOfReads);

	return sortedHistory?.slice(0, maxCount);
}

async function fetchUser(user?: string) {
	const { userId } = auth();
	const uid = user ?? userId;

	if (!uid) {
		return;
	}

	return await getUser(uid);
}

export async function getBookmarksByUser<TUserId extends Pick<User, "id">>(
	user: TUserId,
) {
	const bookmarks = await getBookmarksByCollectionId(user.id);
	const bookmarkIds = Object.keys(bookmarks);
	return bookmarkIds;
}

export function getHistoryByUser<TUserId extends Pick<User, "paperActivities">>(
	user: TUserId,
) {
	const readHistoryIds = sortAndFilter(user.paperActivities)?.map(
		(paper) => paper.paperId,
	);
	return readHistoryIds;
}

export type PaperId = string;
export async function getBookmarksAndHistory(
	userId?: Parameters<typeof fetchUser>[0],
): Promise<[PaperId[], PaperId[]] | null> {
	return fetchUser(userId).then(async (user) => {
		if (!user) {
			return null;
		}
		const bookmarkIds = await getBookmarksByUser(user);
		const readHistoryIds = getHistoryByUser(user);
		return [bookmarkIds, readHistoryIds];
	});
}
