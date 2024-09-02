import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { CollectionService } from "@/services/collection-service";
import {
	PostService,
	PostWithCommentsAndAuthor,
} from "@/services/post-service";
import { auth } from "@clerk/nextjs/server";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type AssistantData = {
	space?: Collection;
	paper?: OpenAlexPaper;
	posts: PostWithCommentsAndAuthor[];
};

const schema = z.object({
	spaceId: z.string().optional(),
	paperId: z.string().optional(),
});

export async function POST(request: NextRequest) {
	// TODO: Rate limit

	const params = await request.json();
	const { spaceId, paperId } = schema.parse(params);
	console.log(spaceId, paperId);

	const { userId, orgId } = auth();
	const [space, paper, posts] = await Promise.all([
		getSpacePromise(spaceId, userId, orgId),
		getPaperPromise(paperId),
		PostService.getPostsWithCommentsAndAuthors(spaceId, paperId),
	]);

	return NextResponse.json({
		space,
		paper,
		posts,
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
