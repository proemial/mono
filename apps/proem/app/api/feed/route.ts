import { CachedFeed } from "@/app/data/cached-feed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const collectionId = searchParams.get("collection_id");
	const institutionId = searchParams.get("institution_id");
	const offset = Number(searchParams.get("offset")) || 1;

	if (!collectionId && !institutionId) {
		return NextResponse.json(
			{ error: "Collection ID or institution ID is required" },
			{ status: 400 },
		);
	}

	if (institutionId) {
		// const feed = await Feed.fromInstitution(institutionId, { offset });
		const feed = {};
		return NextResponse.json(feed);
	}

	if (collectionId) {
		const feed = await CachedFeed.fromCollection(collectionId, { offset });
		return NextResponse.json(feed);
	}
}
