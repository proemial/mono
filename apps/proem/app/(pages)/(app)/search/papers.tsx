"use client";
import { OpenAlexWorkMetadata } from "@proemial/repositories/oa/models/oa-paper";
import { Paper } from "./paper";
import { Bookmarks } from "../(discover)/add-to-collection-button";

export function Papers({
	papers,
	bookmarks,
}: { papers: OpenAlexWorkMetadata[]; bookmarks: Bookmarks }) {
	return (
		<div className="space-y-4">
			<>
				<div className="w-full">Search results:</div>
				{papers.map((paper, i) => (
					<Paper key={i} paper={paper} bookmarks={bookmarks} />
				))}
			</>
		</div>
	);
}
