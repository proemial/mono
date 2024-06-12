import { getInternalUser } from "@/app/hooks/get-internal-user";
import { IconButton } from "@/components/collections/icon-button";
import { getFeatureFilter } from "@/components/fingerprints/features";
import { FEED_DEFAULT_DAYS } from "@/components/fingerprints/fetch-by-features";
import { fetchFeedByFeatures } from "@/components/fingerprints/fetch-feed";
import { fetchFingerprints } from "@/components/fingerprints/fetch-fingerprints";
import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { Avatar, AvatarImage, Header2, Paragraph } from "@proemial/shadcn-ui";
import { FilePlus02, Upload01 } from "@untitled-ui/icons-react";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import FeedItem from "../../discover/feed-item";

type PageProps = {
	params?: {
		id: string;
	};
	// searchParams?: unknown;
};

export default async function ({ params }: PageProps) {
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
		// @ts-ignore This is for future-Jon to care about
		.sort((a, b) => a.firstName.localeCompare(b.firstName));

	const paperIds = collection.collectionsToPapers.map((c) => c.paperId);
	const fingerprints = await fetchFingerprints(paperIds);
	const { filter: features } = getFeatureFilter(fingerprints);
	const { rows } = await fetchFeedByFeatures(
		{ features, days: FEED_DEFAULT_DAYS },
		{ offset: 0 },
	);
	const papers = rows.map((row) => row.paper);

	return (
		<div className="flex flex-col grow gap-4">
			<div className="flex flex-col gap-3">
				<Header2>{collection.name}</Header2>
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
			{paperIds.length > 0 ? (
				<div className="space-y-8 my-8">
					{papers.map((paper) => (
						<FeedItem key={paper.id} paper={paper} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-4">
					<div className="text-sm">There are no papers in this collection.</div>
				</div>
			)}
		</div>
	);
}
