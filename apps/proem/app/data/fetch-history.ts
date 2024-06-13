import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { PaperActivity, users } from "@proemial/data/neon/schema";

// Max no. of papers from read history to use in filter
const MAX_COUNT = 10;

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

	const sortedHistory = readHistory?.sort((a, b) => b.noOfReads - a.noOfReads);
	const multiples = sortedHistory?.filter((p) => p.noOfReads > 1);
	if (multiples?.length) {
		return multiples.slice(0, maxCount);
	}

	return sortedHistory?.slice(0, maxCount);
}
