"use client";
import { Collection } from "@proemial/data/neon/schema";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { Bookmarks } from "../space/(discover)/add-to-collection-button";
import { Paper } from "./paper";

export function Papers({
	papers,
	bookmarks,
	collectionId,
}: {
	papers: OpenAlexWorkMetadata[];
	bookmarks: Bookmarks;
	collectionId?: Collection["id"];
}) {
	return (
		<>
			<div className="w-full mb-2">Search results:</div>
			<div className="space-y-4">
				{papers.map((paper, i) => (
					<Paper
						key={i}
						paper={paper}
						bookmarks={bookmarks}
						collectionId={collectionId}
					/>
				))}
			</div>
		</>
	);
}
