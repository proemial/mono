type PaginationOptions = {
	offset: number;
	limit: number;
};
type FEED_PERCENTAGES = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;

/**
 * Shuffles the rows of a feed items in a deterministic way
 */
export const shuffleFeed = <TFeed extends { rows: { id: string }[] }>(
	feed: TFeed,
) => {
	return {
		...feed,
		rows: feed.rows.sort((a, b) => a.id.localeCompare(b.id)),
	};
};

/**
 * Merges multiple feeds into one
 */
export const mergeFeed = async <TRow extends { id: string }>(
	feeds: {
		feed: ({ offset, limit }: PaginationOptions) => Promise<{
			count: number;
			rows: TRow[];
			nextOffset: number;
		}>;
		percentage: FEED_PERCENTAGES;
	}[],
	{ offset, limit }: PaginationOptions,
) => {
	const fetchedFeeds = await Promise.all(
		feeds.map((feed) => {
			const feedLimit = Math.floor(limit * feed.percentage);
			const feedOffset = offset * feedLimit;

			return feed.feed({ offset: feedOffset, limit: feedLimit });
		}),
	);

	if (fetchedFeeds.every((feed) => feed?.rows.length === 0)) {
		return null;
	}
	const mergedFeed = shuffleFeed(
		fetchedFeeds.reduce(
			(acc, feed) => {
				if (!feed) return acc;

				return {
					count: acc.count + feed.count,
					rows: [...acc.rows, ...feed.rows],
					nextOffset: acc.nextOffset,
				};
			},
			{ count: 0, rows: [], nextOffset: offset + 1 },
		),
	);


	return mergedFeed;
};
