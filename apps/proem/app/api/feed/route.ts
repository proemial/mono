import { CachedFeed } from "@/app/data/cached-feed";
import { ChartNoAxesColumnDecreasing } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

export type FeedResponse = ReturnType<typeof CachedFeed.fromCollection>;
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const collectionId = searchParams.get("collection_id");
	const institutionId = searchParams.get("institution_id");
	const offset = Number(searchParams.get("offset")) || 1;

	if (institutionId) {
		// const feed = await Feed.fromInstitution(institutionId, { offset });
		const feed = {};
		return NextResponse.json(feed);
	}

	if (collectionId) {
		const feed = await CachedFeed.fromCollection(collectionId, { offset });
		return NextResponse.json(feed);
	}

	const feed = await CachedFeed.fromPublic(offset);
	return NextResponse.json(feed);
}
