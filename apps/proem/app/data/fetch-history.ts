import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { PaperActivity, users } from "@proemial/data/neon/schema";
import dayjs from "dayjs";

// Max no. of papers from read history to use in filter
const MAX_COUNT = 30;

export async function getHistory() {
	const ids = [];

	const { userId } = auth();
	if (userId) {
		const user = await neonDb.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const papers = sortAndFilter(user?.paperActivities);
		if (papers) {
			for (const paper of papers) {
				ids.push(paper.paperId);
			}
		}
	}

	return ids;
}

function sortAndFilter(readHistory?: PaperActivity[]) {
	const maxCount = MAX_COUNT;

	const sortedHistory = readHistory
		?.sort(
			(a, b) => dayjs(b.lastReadAt).valueOf() - dayjs(a.lastReadAt).valueOf(),
		)
		.sort((a, b) => b.noOfReads - a.noOfReads);

	return sortedHistory?.slice(0, maxCount);
}
