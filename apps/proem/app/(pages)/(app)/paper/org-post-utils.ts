import { auth, clerkClient } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { Comment, Post, papers, posts } from "@proemial/data/neon/schema";
import { eq, inArray } from "drizzle-orm";

export type PaperPost = Omit<Post, "paperId"> & {
	comments: Omit<Comment, "postId">[];
};

export const getOrgMemberPaperPosts = async (paperId: string) => {
	const orgMemberIds = await getOrgMemberIds();
	if (orgMemberIds.length === 0) {
		return [];
	}
	const paper = await neonDb.query.papers.findFirst({
		where: eq(papers.id, paperId),
		with: {
			posts: {
				columns: {
					paperId: false,
				},
				with: {
					comments: {
						columns: {
							postId: false,
						},
					},
				},
				where: inArray(posts.authorId, orgMemberIds),
			},
		},
	});
	return paper?.posts ?? ([] satisfies PaperPost[]);
};

const getOrgMemberIds = async () => {
	const user = auth();
	const { orgId } = user;
	if (!orgId) {
		return [];
	}
	const orgMemberships =
		await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: orgId,
		});
	const orgMemberIds = orgMemberships
		.map((membership) => membership.publicUserData?.userId)
		.filter(Boolean) as string[];
	return orgMemberIds;
};
