import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { users } from "@proemial/data/neon/schema";

export const addPaperActivity = async (paperId: string) => {
	const { userId } = auth();
	if (!userId) {
		return;
	}
	// Add user if not already exists
	const userResult = await neonDb
		.insert(users)
		.values({ id: userId })
		.onConflictDoUpdate({
			target: [users.id],
			set: { id: userId },
		})
		.returning();
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
	await neonDb
		.insert(users)
		.values({
			id: userId,
			paperActivities: activitiesSortedReadDate,
		})
		.onConflictDoUpdate({
			target: [users.id],
			set: {
				paperActivities: activitiesSortedReadDate,
			},
		});
};
