import { PaginationOptions, PaginationResult } from "./merge-feed";

export const iterateStaticFeed =
	<TFeedItem extends { id: string }>(feed: TFeedItem[]) =>
	({
		offset = 0,
		limit = 10,
	}: PaginationOptions): PaginationResult<TFeedItem> => {
		console.log(feed);
		return {
			rows: feed.slice(offset, offset + limit),
			count: feed.length,
			nextOffset: offset + limit,
		};
	};
