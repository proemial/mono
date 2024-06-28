import { getPersonalDefaultCollection } from "@/app/constants";
import { Main } from "@/components/main";
import { ToggleSearchAction } from "@/components/nav-bar/actions/toggle-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ProemAssistant } from "@/components/proem-assistant";
import { routes } from "@/routes";
import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import {
	findCollectionWithPaperIdsBySlug,
	findCollectionsByUserIdAndOrgMemberIds,
} from "@proemial/data/repository/collection";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type PageProps = {
	params?: {
		id: string;
	};
	children: ReactNode;
};

export default async function ({ params, children }: PageProps) {
	const { userId, orgId } = auth();
	if (!userId || !params?.id) {
		redirect(routes.space);
	}

	const collection = await getCollection(params.id, userId);
	if (!collection) {
		redirect(routes.space);
	}

	const orgMemberships = orgId
		? await clerkClient.organizations.getOrganizationMembershipList({
				organizationId: orgId,
			})
		: [];

	const orgMembersUserData = (
		orgMemberships
			.map((membership) => membership.publicUserData)
			.filter(Boolean) as OrganizationMembershipPublicUserData[]
	).sort((a, b) => (a.firstName ?? "").localeCompare(b.firstName ?? ""));

	const userCollections = await findCollectionsByUserIdAndOrgMemberIds(
		userId,
		orgMembersUserData.map((m) => m.userId),
	);

	return (
		<>
			<NavBar action={<ToggleSearchAction />}>
				<SelectSpaceHeader collections={userCollections} userId={userId} />
			</NavBar>
			<Main>{children}</Main>
			<ProemAssistant />
		</>
	);
}

const getCollection = async (slug: string, userId: string) => {
	const collection = await findCollectionWithPaperIdsBySlug(slug);
	if (collection) {
		return collection;
	}
	if (slug === userId) {
		return getPersonalDefaultCollection(userId);
	}
	return undefined;
};
