import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { getBookmarkCacheTag } from "@/app/constants";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getHistory } from "@/app/data/fetch-history";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { FeatureCloud } from "@/components/feature-badges";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { auth } from "@clerk/nextjs";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import {
	fetchFingerprints,
	fetchPapersTitles,
} from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { OaFields } from "@proemial/repositories/oa/taxonomy/fields";
import { Badge } from "@proemial/shadcn-ui";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { FeedFilter } from "./feed-filter";

const getBookmarks = (userId: string) =>
	unstable_cache(
		async () => {
			const usersBookmarks = await neonDb.query.collections.findMany({
				// where: { ownerId: "user_2Zrcp6UuNROrHQ7jo32HduhYDsJ" },
				columns: { id: true },
				where: eq(collections.ownerId, userId),
				with: { collectionsToPapers: true },
			});

			return usersBookmarks.reduce(
				(acc, collection) => {
					for (const paper of collection.collectionsToPapers) {
						if (acc[paper.paperId]) {
							// @ts-expect-error we just checked for it above
							acc[paper.paperId].push(collection.id);
						} else {
							acc[paper.paperId] = [collection.id];
						}
					}

					return acc;
				},
				{} as Record<string, string[]>,
			);
		},
		["bookmarks", userId],
		{ tags: [getBookmarkCacheTag(userId)] },
	)();

type Props = {
	searchParams?: {
		topic?: string;
		days?: string;
		debug?: boolean;
		weights?: string; // weights=c:0.5,t:1.1,k:0.9
		nocache?: boolean;
	};
};

export default async function DiscoverPage({ searchParams }: Props) {
	const params = {
		topic: searchParams?.topic as string,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
		debug: searchParams?.debug,
		weightsRaw: searchParams?.weights,
	};
	const { userId } = auth();

	const [filter, bookmarks] = await Promise.all([
		getFilter(params),
		userId ? getBookmarks(userId) : {},
	]);

	return (
		<div className="space-y-6">
			<Feed
				filter={filter}
				debug={params.debug}
				bookmarks={bookmarks}
				nocache={searchParams?.nocache}
			>
				{!filter.features && (
					<div className="-my-4">
						<HorisontalScrollArea>
							<FeedFilter
								items={[
									"all",
									...OaFields.map((field) => field.display_name.toLowerCase()),
								]}
								rootPath="/discover"
							/>
						</HorisontalScrollArea>
					</div>
				)}
				{params.debug && (
					<>
						<Titles titles={filter.titles} />
						<FeatureCloud features={filter.all} />
					</>
				)}
			</Feed>
		</div>
	);
}

function Titles({ titles }: { titles?: { id: string; title: string }[] }) {
	return (
		<div className="space-1">
			<span className="text-xs font-bold mr-1">Read history: </span>
			{titles?.map((paper) => (
				<Badge key={paper.id}>{paper.title}</Badge>
			))}
		</div>
	);
}

async function getFilter(params: {
	topic: string;
	days: number;
	debug?: boolean;
	weightsRaw?: string;
}) {
	const { isInternal } = getInternalUser();

	if (!isInternal) {
		const topic = OaFields.find(
			(c) =>
				c.display_name.toLowerCase() ===
				decodeURI(params.topic).replaceAll("%2C", ","),
		)?.id;

		return { topic };
	}

	const history = await getHistory();
	const fingerprints = await fetchFingerprints(history);
	const { filter, allFeatures } = getFeatureFilter(
		fingerprints,
		params.weightsRaw,
	);
	const titles = params.debug ? await fetchPapersTitles(history) : undefined;

	return { features: filter, days: params.days, titles, all: allFeatures };
}
