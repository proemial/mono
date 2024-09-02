import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

const CLERK_CACHE_TTL = 60; // In seconds

const getMemberByOrganisationId = async (organizationId: string) =>
	unstable_cache(
		async () =>
			// todo: handle pagination
			clerkClient().organizations.getOrganizationMembershipList({
				organizationId,
			}),
		[organizationId],
		{ revalidate: CLERK_CACHE_TTL },
	)();

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
		return undefined;
	}
};

export const getUsers = async (userIds: string[]) => {
	try {
		const { data: users } = await getUsersByIds(...userIds);
		return users;
	} catch (error) {
		console.error("Error fetching users from auth provieder", error);
		return [];
	}
};

export const getOrgMembersUserData = async () => {
	const orgMemberships = await getOrgMemberships();
	return orgMemberships
		.filter((membership) => membership.publicUserData)
		.map(
			(membership) => membership.publicUserData,
		) as OrganizationMembershipPublicUserData[];
};

export const getOrgMemberships = async () => {
	const { orgId } = auth();
	if (!orgId) return [];

	const { data: memberships } = await getMemberByOrganisationId(orgId);

	return memberships.sort((a, b) =>
		(a.publicUserData?.firstName ?? "").localeCompare(
			b.publicUserData?.firstName ?? "",
		),
	);
};
