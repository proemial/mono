import {
	OrganizationMembershipPublicUserData,
	clerkClient,
} from "@clerk/nextjs/server";

export module Organisation {
	const getMemberByOrganisationId = async (organizationId: string) => {
		// todo: handle pagination
		return clerkClient().organizations.getOrganizationMembershipList({
			organizationId,
		});
	};

	const getUserById = async (userId: string) => {
		return clerkClient().users.getUser(userId);
	};

	const getUsersByIds = async (...userIds: string[]) => {
		return clerkClient().users.getUserList({
			userId: userIds,
		});
	};

	export const getUser = async (userId: string) => {
		if (!userId) return undefined;
		try {
			return await getUserById(userId);
		} catch (error) {
			console.error("Error fetching user from auth provieder", error);
		}
	};

	export const getUsers = async (userIds: string[]) => {
		if (userIds.length === 0) return [];
		try {
			const { data: users } = await getUsersByIds(...userIds);
			return users;
		} catch (error) {
			console.error("Error fetching users from auth provider", error);
			return [];
		}
	};

	export const getOrgMembersUserData = async (organisationId?: string) => {
		if (!organisationId) return [];

		const orgMemberships = await getOrgMemberships(organisationId);
		return orgMemberships
			.filter((membership) => membership.publicUserData)
			.map(
				(membership) => membership.publicUserData,
			) as OrganizationMembershipPublicUserData[]; // TODO!: type
	};

	export const getOrgMemberships = async (organisationId: string) => {
		const { data: memberships } =
			await getMemberByOrganisationId(organisationId);

		return memberships.sort((a, b) =>
			(a.publicUserData?.firstName ?? "").localeCompare(
				b.publicUserData?.firstName ?? "",
			),
		);
	};
}
