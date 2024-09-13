import {
	OrganizationMembershipPublicUserData,
	clerkClient,
} from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

const CLERK_CACHE_TTL = 60; // In seconds

export module Organisation {
	const getMemberByOrganisationId = async (organizationId: string) => {
		return unstable_cache(
			async () =>
				// todo: handle pagination
				clerkClient().organizations.getOrganizationMembershipList({
					organizationId,
				}),
			[organizationId],
			{ revalidate: CLERK_CACHE_TTL },
		)();
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
