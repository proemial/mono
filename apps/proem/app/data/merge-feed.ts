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
		// TODO! this doesn't work as most popular papers often is older and therefore always shuffled to the top
		rows: feed.rows.sort((a, b) => a.id.localeCompare(b.id)),
	};
};

/**
 * Merges multiple feeds into one
 */
export const mergeFeed = async <
	TFeeds extends {
		fetch: ({
			offset,
			limit,
		}: PaginationOptions) => Promise<PaginationResult<{ id: string }> | null>;
		percentage: FEED_PERCENTAGES;
	}[],
>(
	feeds: TFeeds,
	{ offset = 0, limit = 10 }: PaginationOptions,
) => {
	// TODO! handle overfetching if percentage is not 1
	// TODO! handle overfetching if 1 or more feeds return null
	const fetchedFeeds = await Promise.all(
		feeds.map((feed) => {
			const feedLimit = limit * feed.percentage;

			return feed.fetch({
				offset,
				limit: feedLimit,
			});
		}),
	);

	if (fetchedFeeds.every((feed) => feed?.rows.length === 0)) {
		return null;
	}

	const mergedFeed = shuffleFeed(
		fetchedFeeds
			.filter((feed) => feed !== null)
			.reduce((acc, feed) => {
				if (!acc)
					return {
						count: 0,
						rows: [],
						nextOffset: offset + 1,
					};
				if (!feed) return acc;

				return {
					count: acc.count + feed.count,
					rows: [...acc.rows, ...feed.rows],
					nextOffset: acc.nextOffset,
				};
			}),
	);

	// Not the prettiest typing but works for now.
	// We need an intersection of all fetch functions return type
	return mergedFeed as Awaited<ReturnType<TFeeds[number]["fetch"]>>;
};
