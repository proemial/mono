import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { PaperActivity, users } from "@proemial/data/neon/schema";

export async function getHistory() {
	const ids = [];

	const { userId } = auth();
	if (userId) {
		const user = await neonDb.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const papers = filterPapers(user?.paperActivities);
		if (papers) {
			for (const paper of papers) {
				ids.push(paper.paperId);
			}
		}
	}

	return ids;
}

function filterPapers(papers?: PaperActivity[]) {
	const maxCount = 10;

	const multiples = papers?.filter((p) => p.noOfReads > 1);
	if (multiples?.length) {
		return multiples.slice(0, maxCount);
	}

	return papers?.slice(0, maxCount);
}
