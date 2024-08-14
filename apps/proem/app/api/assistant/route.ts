import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { CollectionService } from "@/services/collection-service";
import { PaperPost, PostService } from "@/services/post-service";
import { auth } from "@clerk/nextjs/server";
import { Answer, Collection } from "@proemial/data/neon/schema";
import { answers } from "@proemial/data/repository/answer";
import { findCollectionById } from "@proemial/data/repository/collection";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type AssistantData = {
	space?: Collection;
	paper?: OpenAlexPaper;
	posts: PaperPost[];
	answers: Answer[];
};

const schema = z.object({
	spaceId: z.string().optional(),
	paperId: z.string().optional(),
});

export async function POST(request: NextRequest) {
	// TODO: Rate limit

	const params = await request.json();
	const { spaceId, paperId } = schema.parse(params);

	const { userId, orgId } = auth();
	const [space, paper, posts, answers] = await Promise.all([
		getSpacePromise(spaceId, userId, orgId),
		getPaperPromise(paperId),
		getPosts(paperId, spaceId),
		getUserAnswers(userId, paperId),
	]);

	return NextResponse.json({
		space,
		paper,
		posts,
		answers,
	} satisfies AssistantData);
}

const getSpacePromise = async (
	spaceId: string | undefined,
	userId: string | null,
	orgId: string | null | undefined,
) => {
	if (!spaceId) return undefined;
	return await CollectionService.getCollection(spaceId, userId, orgId);
};

const getPaperPromise = async (paperId: string | undefined) => {
	if (!paperId) return undefined;
	return await fetchPaper(paperId);
};

const getPosts = async (
	paperId: string | undefined,
	spaceId: string | undefined,
): Promise<PaperPost[]> => {
	if (paperId) {
		const paper = await PostService.getSinglePaperIdWithPosts(paperId, spaceId);
		return paper?.posts ?? [];
	}
	if (spaceId) {
		const space = await findCollectionById(spaceId);
		if (space) {
			const paperIds = space.collectionsToPapers.map((c) => c.paperId);
			const papers = await PostService.getPaperIdsWithPosts(paperIds, spaceId);
			return papers.flatMap((p) => p.posts);
		}
	}
	return [];
};

const getUserAnswers = async (
	userId: string | null,
	paperId: string | undefined,
) => {
	if (!userId || paperId) return []; // Don't fetch user answers if on a paper
	return await answers.get10LatestByUserId(userId);
};
