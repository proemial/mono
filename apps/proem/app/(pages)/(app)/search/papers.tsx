"use client";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { Paper } from "./paper";
import { Bookmarks } from "../(discover)/add-to-collection-button";

export function Papers({
	papers,
	bookmarks,
}: { papers: OpenAlexWorkMetadata[]; bookmarks: Bookmarks }) {
	return (
		<>
			<div className="w-full mb-2">Search results:</div>
			<div className="space-y-4">
				{papers.map((paper, i) => (
					<Paper key={i} paper={paper} bookmarks={bookmarks} />
				))}
			</div>
		</>
	);
}
