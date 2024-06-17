import { getInternalUser } from "@/app/hooks/get-internal-user";
import { IconButton } from "@/components/collections/icon-button";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import {
	Avatar,
	AvatarImage,
	Header2,
	Header5,
	Paragraph,
} from "@proemial/shadcn-ui";
import { FilePlus02 } from "@untitled-ui/icons-react";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import { NavButton } from "./nav-item";

type PageProps = {
	params?: {
		id: string;
	};
	children: ReactNode;
};

export default async function ({ params, children }: PageProps) {
	// TODO: Remove this check when launching feature
	const { isInternal } = getInternalUser();
	if (!isInternal) {
		redirect("/");
	}

	const { userId, orgId } = auth();
	if (!userId || !orgId || !params?.id) {
		notFound();
	}

	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.slug, params.id),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});
	if (!collection) {
		notFound();
	}

	const user = await clerkClient.users.getUser(userId);
	const orgMemberships =
		await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: orgId,
		});
	const otherOrgMembersUserData = (
		orgMemberships
			.map((membership) => membership.publicUserData)
			.filter(Boolean) as OrganizationMembershipPublicUserData[]
	)
		.filter((data) => data.userId !== userId)
		.sort((a, b) => (a.firstName ?? "").localeCompare(b.firstName ?? ""));

	return (
		<>
			<NavBarV2 action={<OpenSearchAction />} isInternalUser={isInternal}>
				<SelectSpaceHeader collectionName={collection.name} />
			</NavBarV2>
			<Main>
				<div className="flex flex-col grow gap-10">
					<div className="flex flex-col gap-3">
						<Paragraph>{collection.description}</Paragraph>
						<div className="flex gap-2 justify-between items-center">
							<div className="flex gap-2 items-center">
								<Avatar className="size-6 hover:brightness-110 duration-200">
									<AvatarImage
										src={user.imageUrl}
										title={`${user.firstName} ${user.lastName} (you)`}
									/>
								</Avatar>
								{otherOrgMembersUserData.map((orgMember) => (
									<Avatar
										key={orgMember.userId}
										className="-ml-[18px] size-6 hover:brightness-110 duration-200"
										title={`${orgMember.firstName} ${orgMember.lastName}`}
									>
										<AvatarImage src={orgMember.imageUrl} />
									</Avatar>
								))}
								<div className="text-sm">
									{otherOrgMembersUserData.length + 1} members
								</div>
							</div>
							<div className="flex gap-4">
								<IconButton title="Add a paper…">
									<FilePlus02 className="size-[18px] opacity-75" />
								</IconButton>
								{/* <IconButton>
							<Upload01 className="size-[18px] opacity-75" />
						</IconButton> */}
							</div>
						</div>
					</div>
					<div className="flex gap-1 justify-center items-center">
						<NavButton
							href={`/collection/${collection.slug}`}
							title="Collection"
						/>
						<NavButton
							href={`/collection/${collection.slug}/stream`}
							title="Stream"
						/>
					</div>
					{children}
				</div>
			</Main>
		</>
	);
}
