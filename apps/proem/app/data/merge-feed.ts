export type PaginationOptions = {
	offset?: number;
	limit?: number;
};

export type PaginationResult<T extends { id: string }> = {
	count: number;
	rows: T[];
	nextOffset: number;
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
export const mergeFeed = async <
	T extends Promise<PaginationResult<{ id: string }> | null>,
>(
	feeds: {
		fetch: ({ offset, limit }: PaginationOptions) => NoInfer<T>;
		percentage: FEED_PERCENTAGES;
	}[],
	{ offset = 0, limit = 10 }: PaginationOptions,
) => {
	// TODO! handle overfetching if percentage is not 1
	// TODO! handle overfetching if 1 or more feeds return null
	const fetchedFeeds = await Promise.all(
		feeds.map((feed) => {
			const feedLimit = limit * feed.percentage;
			const feedOffset = offset;

			return feed.fetch({
				offset,
				limit: feedLimit,
			});
		}),
	);

	if (fetchedFeeds.every((feed) => feed?.rows.length === 0)) {
		return null;
	}
	// const rowCount = fetchedFeeds.flatMap((feed) => feed?.rows ?? []).length;

	const mergedFeed = shuffleFeed(
		fetchedFeeds
			.filter((feed) => feed !== null)
			.reduce(
				(acc, feed) => {
					if (!feed) return acc;

					return {
						count: acc.count + feed.count,
						rows: [...acc.rows, ...feed.rows],
						nextOffset: acc.nextOffset,
					};
				},
				{
					count: 0,
					rows: [] as { id: string }[],
					nextOffset: offset + 1,
				},
			),
	);

	return mergedFeed;
};
