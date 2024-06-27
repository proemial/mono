import { getPersonalDefaultCollection } from "@/app/constants";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
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
import { Avatar, AvatarImage, Paragraph } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { NavItem } from "./nav-item";

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

	const isDefaultCollection = collection.id === userId;

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
			<NavBar action={<OpenSearchAction />}>
				<SelectSpaceHeader collections={userCollections} userId={userId} />
			</NavBar>
			<Main>
				<div className="flex flex-col grow gap-2">
					<div className="flex flex-col gap-3">
						{!isDefaultCollection && (
							<Paragraph>{collection.description}</Paragraph>
						)}
						<div className="flex gap-2 justify-between items-center flex-row-reverse">
							<div className="flex gap-4">
								{/* <IconButton title="Add a paper…">
									<FilePlus02 className="size-[18px] opacity-75" />
								</IconButton>
								<IconButton>
									<Upload01 className="size-[18px] opacity-75" />
								</IconButton> */}
							</div>
							{!isDefaultCollection && orgMembersUserData ? (
								<div className="flex gap-2 items-center">
									{orgMembersUserData.map((orgMember) => (
										<Avatar
											key={orgMember.userId}
											className="-ml-[18px] first:ml-0 size-6 hover:brightness-110 duration-200"
											title={`${orgMember.firstName} ${orgMember.lastName}`}
										>
											<AvatarImage src={orgMember.imageUrl} />
										</Avatar>
									))}
									<div className="text-sm">
										{orgMembersUserData.length} members
									</div>
								</div>
							) : null}
						</div>
					</div>
					<div className="flex gap-1 justify-center items-center">
						<NavItem
							href={`${routes.space}/${collection.slug}`}
							title="Latest"
						/>
						<NavItem
							href={`${routes.space}/${collection.slug}/saved`}
							title="Saved"
						/>
					</div>
					{children}
				</div>
			</Main>
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
