import { clerkClient } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

const CLERK_CACHE_TTL = 60 * 60 * 24; // 1 day

export module User {
	const getUserById = async (userId: string) =>
		unstable_cache(
			async () => await clerkClient().users.getUser(userId),
			[userId],
			{ revalidate: CLERK_CACHE_TTL },
		)();

	// spread out to have primitives as parameters for the cache to memorize
	const getUsersByIds = async (...userIds: string[]) =>
		unstable_cache(
			async () =>
				// todo: handle pagination
				await clerkClient().users.getUserList({
					userId: userIds,
				}),
			userIds,
			{ revalidate: CLERK_CACHE_TTL },
		)();

	export const getUser = async (userId: string) => {
		if (!userId) return undefined;
		try {
			return await getUserById(userId);
		} catch (error) {
			console.error("Error fetching user from auth provieder", error);
		}
	};

	export const getUsers = async (userIds: string[]) => {
		const validUserIds = userIds.filter((id) => id.startsWith("user_"));

		if (validUserIds.length === 0) return [];
		try {
			const { data: users } = await getUsersByIds(...validUserIds);
			return users;
		} catch (error) {
			console.error("Error fetching users from auth provider", error);
			return [];
		}
	};
}
