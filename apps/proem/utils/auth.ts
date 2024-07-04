import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";

export const getOrgMemberships = async () => {
	const { orgId } = auth();
	const memberships = orgId
		? await clerkClient.organizations.getOrganizationMembershipList({
				organizationId: orgId,
			})
		: [];
	return memberships.sort((a, b) =>
		(a.publicUserData?.firstName ?? "").localeCompare(
			b.publicUserData?.firstName ?? "",
		),
	);
};

export const getOrgMembersUserData = async () => {
	const orgMemberships = await getOrgMemberships();
	return orgMemberships
		.filter((membership) => membership.publicUserData)
		.map(
			(membership) => membership.publicUserData,
		) as OrganizationMembershipPublicUserData[];
};

export const getOrgMemberIds = async () => {
	const orgMembersUserData = await getOrgMembersUserData();
	return orgMembersUserData.map((m) => m.userId);
};

export const getUserData = async (userId: string) =>
	await clerkClient.users.getUser(userId);
