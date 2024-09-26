import { Feed } from "@/app/data/feed";
import { PaginationResult } from "@/app/data/merge-feed";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { NextRequest, NextResponse } from "next/server";

type PaperFeedItem = NonNullable<
	Awaited<ReturnType<typeof Feed.fromFeatures>>
>["rows"][number];

type InstitutionFeedItem = {
	id: string;
	contentType: "institution";
	type: "featured";
	institution: string;
};

export type FeedResponse = Promise<
	PaginationResult<InstitutionFeedItem | PaperFeedItem>
>;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const collectionId = searchParams.get("collection_id");
	const institutionId = searchParams.get("institution_id");
	const offset = Number(searchParams.get("offset")) || 1;

	if (institutionId) {
		const feed = await Feed.fromInstitution(institutionId, {
			offset,
			limit: 10,
		});
		return NextResponse.json(feed);
	}

	if (collectionId) {
		const feed = await Feed.fromCollection(collectionId, { offset, limit: 10 });
		return NextResponse.json(feed);
	}

	const feed = await Feed.fromPublic({ offset, limit: 10 });
	return NextResponse.json(feed);
}
