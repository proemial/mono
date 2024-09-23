import { PaginationResult } from "./merge-feed";

export const iterateStaticFeed =
	<TFeedItem extends { id: string }>(feed: TFeedItem[]) =>
	({
		offset,
		limit,
	}: { offset: number; limit: number }): PaginationResult<TFeedItem> => {
		console.log(feed);
		return {
			rows: feed.slice(offset, offset + limit),
			count: feed.length,
			nextOffset: offset + limit,
		};
	};
