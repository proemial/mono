import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { HorisontalScrollArea } from "@/components/horisontal-scroll-area";
import { FeedFilter } from "./feed-filter";
import { OaFields } from "@proemial/models/open-alex-fields";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { getHistory } from "./fingerprints/fetch-history";
import { fetchFingerprints } from "@/components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "@/components/fingerprints/features";

type Props = {
	searchParams?: {
		topic?: string;
		days?: string;
	};
};

export default async function DiscoverPage({ searchParams }: Props) {
	const params = {
		topic: searchParams?.topic as string,
		days: searchParams?.days ? Number.parseInt(searchParams.days) : 14,
	};
	const filter = await getFilter(params);

	return (
		<div className="space-y-6">
			<Feed filter={filter}>
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
			</Feed>
		</div>
	);
}

async function getFilter(params: { topic: string; days: number }) {
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
	const { filter } = getFeatureFilter(fingerprints);

	return { features: filter, days: params.days };
}
