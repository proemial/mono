import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { cache } from "react";

const getMemberByOrganisationId = cache((organizationId: string) => {
	console.log("tick");
	// todo: handle pagination
	return clerkClient().organizations.getOrganizationMembershipList({
		organizationId,
	});
});

const getUserById = cache(async (userId: string) => {
	console.log("tick");
	return await clerkClient().users.getUser(userId);
});

// spread out to have primitives as parameters for the cache to memorize
const getUsersByIds = cache(async (...userIds: string[]) => {
	console.log("tick");
	// todo: handle pagination
	return await clerkClient().users.getUserList({
		userId: userIds,
	});
});

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
