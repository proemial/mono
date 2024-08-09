import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { FeatureCloud } from "@/components/feature-badges";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { Main } from "@/components/main";
import { ProemAssistant } from "@/components/proem-assistant";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import {
	fetchFingerprints,
	fetchPapersTitles,
} from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { OaFields } from "@proemial/repositories/oa/taxonomy/fields";
import { Badge } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { FeedFilter } from "./feed-filter";
import { getBookmarksByCollectionId } from "./get-bookmarks-by-collection-id";

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
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}

	const params = {
		topic: searchParams?.topic as string,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
		debug: searchParams?.debug,
		weightsRaw: searchParams?.weights,
		user: searchParams?.user,
	};

	const [filter, bookmarks] = await Promise.all([
		getFilter(params),
		userId ? getBookmarksByCollectionId(userId) : {},
	]);

	return (
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
									rootPath={routes.space}
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

			<ProemAssistant />
		</Main>
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
				<span className="mr-1 text-xs font-bold">Bookmarked: </span>
				{bookmarked?.map((paper) => (
					<Badge key={paper.id}>{paper.title}</Badge>
				))}
			</div>
			<div className="space-1">
				<span className="mr-1 text-xs font-bold">Read: </span>
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
	const history = await getBookmarksAndHistory(params.user);
	const fingerprints = history?.length && (await fetchFingerprints(...history));
	const { filter, allFeatures } = getFeatureFilter(
		fingerprints,
		params.weightsRaw,
	);
	const titles =
		params.debug && history?.length
			? await fetchPapersTitles(...history)
			: undefined;

	return { features: filter, days: params.days, titles, all: allFeatures };
}
