import { streamCacheUpdate } from "@/inngest/populator.task";
import { auth } from "@clerk/nextjs/server";
import {
	getOrCreateUser,
	getOrCreateUserActivities,
} from "@proemial/data/repository/user";
import { waitUntil } from "@vercel/functions";

export const addPaperActivity = async (paperId: string) => {
	const { userId } = auth();
	if (!userId) {
		return;
	}
	// Add user if not already exists
	const userResult = await getOrCreateUser(userId);
	const user = userResult[0];
	if (!user) {
		throw new Error("Failed to add user to database");
	}
	const existingActivities = user.paperActivities;
	const existingActivity = existingActivities.find(
		(a) => a.paperId === paperId,
	);
	if (existingActivity) {
		existingActivities[existingActivities.indexOf(existingActivity)] = {
			...existingActivity,
			lastReadAt: new Date().toISOString(),
			noOfReads: existingActivity.noOfReads + 1,
		};
	} else {
		existingActivities.push({
			paperId,
			lastReadAt: new Date().toISOString(),
			noOfReads: 1,
		});
	}
	const activitiesSortedReadDate = existingActivities.sort(
		(a, b) => b.noOfReads - a.noOfReads,
	);
	await getOrCreateUserActivities(userId, activitiesSortedReadDate);
	waitUntil(streamCacheUpdate.run(userId, "user"));
};
