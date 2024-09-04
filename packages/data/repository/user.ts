import { eq } from "drizzle-orm";
import { neonDb } from "..";
import { PaperActivity, users } from "../neon/schema";

export async function getAllUserIds() {
	const collections = await neonDb.query.collections.findMany();
	return collections.map((collection) => collection.id);
}

export async function getOrCreateUser(userId: string) {
	// Add user if not already exists
	return await neonDb
		.insert(users)
		.values({ id: userId })
		.onConflictDoNothing()
		.returning();
}

export async function getUser(userId: string) {
	return await neonDb.query.users.findFirst({
		where: eq(users.id, userId),
	});
}

export async function getOrCreateUserActivities(
	userId: string,
	activities: PaperActivity[],
) {
	// Add user if not already exists
	return await neonDb
		.insert(users)
		.values({
			id: userId,
			paperActivities: activities,
		})
		.onConflictDoUpdate({
			target: [users.id],
			set: {
				paperActivities: activities,
			},
		});
}
