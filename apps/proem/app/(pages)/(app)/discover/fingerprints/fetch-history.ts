import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { users } from "@proemial/data/neon/schema";

const mock = [
	{
		paperId: "W4399270899",
		noOfReads: 6,
		lastReadAt: "2024-06-03T10:21:05.913Z",
	},
	{
		paperId: "W4399270903",
		noOfReads: 4,
		lastReadAt: "2024-06-03T10:20:18.402Z",
	},
	{
		paperId: "W4399325367",
		noOfReads: 4,
		lastReadAt: "2024-06-06T07:21:00.924Z",
	},
	{
		paperId: "W4399323734",
		noOfReads: 3,
		lastReadAt: "2024-06-05T09:43:06.182Z",
	},
	{
		paperId: "W4399270945",
		noOfReads: 3,
		lastReadAt: "2024-06-03T10:21:22.076Z",
	},
	{
		paperId: "W4379958454",
		noOfReads: 2,
		lastReadAt: "2024-05-31T11:22:44.111Z",
	},
	{
		paperId: "W4399319410",
		noOfReads: 1,
		lastReadAt: "2024-06-06T07:22:21.176Z",
	},
];

export async function getHistory() {
	const ids = [];

	const { userId } = auth();
	if (userId) {
		const user = await neonDb.query.users.findFirst({
			where: eq(users.id, userId),
		});
		const papers = user?.paperActivities.slice(0, 10);
		if (papers) {
			for (const paper of papers) {
				ids.push(paper.paperId);
			}
		}
	}

	// return mock;
	return ids;
}
