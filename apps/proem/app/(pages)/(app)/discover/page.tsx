import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { FeedFilter } from "./feed-filter";
import { OaFields } from "@proemial/models/open-alex-fields";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { getHistory } from "@/components/fingerprints/fetch-history";
import {
	fetchFingerprints,
	fetchPapersTitles,
} from "@/components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "@/components/fingerprints/features";
import { FeatureCloud } from "@/components/fingerprints/feature-cloud";
import { FeatureBadge } from "@/components/fingerprints/feature-badge";
import { Badge } from "@proemial/shadcn-ui";
import { FEED_DEFAULT_DAYS } from "@/components/fingerprints/fetch-by-features";

type Props = {
	searchParams?: {
		topic?: string;
		days?: string;
		debug?: boolean;
	};
};

export default async function DiscoverPage({ searchParams }: Props) {
	const params = {
		topic: searchParams?.topic as string,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
		debug: searchParams?.debug,
	};
	const filter = await getFilter(params);

	return (
		<div className="space-y-6">
			<Feed filter={filter} debug={params.debug}>
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
	const { filter, allFeatures } = getFeatureFilter(fingerprints);
	const titles = params.debug ? await fetchPapersTitles(history) : undefined;

	return { features: filter, days: params.days, titles, all: allFeatures };
}
