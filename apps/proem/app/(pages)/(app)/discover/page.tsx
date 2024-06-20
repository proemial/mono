import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { FeatureCloud } from "@/components/feature-badges";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { auth } from "@clerk/nextjs/server";
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
import { FeedFilter } from "./feed-filter";
import { getBookmarksByUserId } from "./get-bookmarks-by-user-id";

type Props = {
	searchParams?: {
		topic?: string;
		days?: string;
		debug?: boolean;
		weights?: string; // weights=c:0.5,t:1.1,k:0.9
		nocache?: boolean;
		user?: string;
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
		user: searchParams?.user,
	};
	const { userId } = auth();
	const { isInternal } = getInternalUser();

	const [filter, bookmarks, userCollections] = await Promise.all([
		getFilter(params),
		userId ? getBookmarksByUserId(userId) : {},
		userId
			? neonDb.query.collections.findMany({
					where: eq(collections.ownerId, userId),
				})
			: [],
	]);

	return (
		<>
			<NavBarV2 action={<OpenSearchAction />} isInternalUser={isInternal}>
				<SimpleHeader title="For You" />
				{/* <SelectSpaceHeader
					collections={userCollections}
					userId={userId ?? ""}
				/> */}
			</NavBarV2>
			<Main>
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
											...OaFields.map((field) =>
												field.display_name.toLowerCase(),
											),
										]}
										rootPath="/discover"
									/>
								</HorisontalScrollArea>
							</div>
						)}
						{params.debug && (
							<>
								<Titles
									bookmarked={filter.titles?.at(0)}
									read={filter.titles?.at(1)}
								/>
								<FeatureCloud features={filter.all} />
							</>
						)}
					</Feed>
				</div>
			</Main>
		</>
	);
}

type WithTitle = { id: string; title: string };

function Titles({
	bookmarked,
	read,
}: { bookmarked?: WithTitle[]; read?: WithTitle[] }) {
	return (
		<>
			<div className="space-1">
				<span className="text-xs font-bold mr-1">Bookmarked: </span>
				{bookmarked?.map((paper) => (
					<Badge key={paper.id}>{paper.title}</Badge>
				))}
			</div>
			<div className="space-1">
				<span className="text-xs font-bold mr-1">Read: </span>
				{read?.map((paper) => (
					<Badge key={paper.id}>{paper.title}</Badge>
				))}
			</div>
		</>
	);
}

async function getFilter(params: {
	topic: string;
	days: number;
	debug?: boolean;
	weightsRaw?: string;
	user?: string;
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

	const history = await getBookmarksAndHistory(params.user);
	const fingerprints = await fetchFingerprints(...history);
	const { filter, allFeatures } = getFeatureFilter(
		fingerprints,
		params.weightsRaw,
	);
	const titles = params.debug ? await fetchPapersTitles(...history) : undefined;

	return { features: filter, days: params.days, titles, all: allFeatures };
}
