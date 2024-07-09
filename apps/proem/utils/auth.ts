import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";

export const getUser = async (userId: string) => {
	if (!userId) return undefined;
	return await clerkClient.users.getUser(userId);
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
