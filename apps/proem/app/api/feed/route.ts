import { Feed } from "@/app/data/feed";
import { NextRequest, NextResponse } from "next/server";

export type FeedResponse = ReturnType<typeof Feed.fromCollection>;

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
