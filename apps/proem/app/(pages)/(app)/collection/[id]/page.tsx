import { getInternalUser } from "@/app/hooks/get-internal-user";
import { IconButton } from "@/components/collections/icon-button";
import { getFeatureFilter } from "@/components/fingerprints/features";
import { fetchFeedByFeatures } from "@/components/fingerprints/fetch-feed";
import {
	fetchFingerprints,
	fetchPapersTitles,
} from "@/components/fingerprints/fetch-fingerprints";
import { getHistory } from "@/components/fingerprints/fetch-history";
import { OaFields } from "@proemial/models/open-alex-fields";
import { Avatar, Header2, Paragraph } from "@proemial/shadcn-ui";
import { FilePlus02, Upload01 } from "@untitled-ui/icons-react";
import { redirect } from "next/navigation";
import FeedItem from "../../discover/feed-item";

type PageProps = {
	params?: {
		id: string;
	};
	// searchParams?: unknown;
};

export default async function ({ params }: PageProps) {
	const { isInternal } = getInternalUser();

	// TODO: Random papers - use papers from collection
	const filter = await getFilter({
		topic: "medicine",
		days: 14,
		debug: false,
	});
	const feed = await fetchFeedByFeatures(
		{ features: filter.features, days: filter.days },
		{ offset: 0 },
	);

	// TODO: Get the collection by ID
	const collection = {
		id: 1,
		name: "Immunology Onboarding",
		description: "Somebody out there probably knows what this could be about.",
		papers: feed.rows.map((row) => row.paper),
	};

	// TODO: Remove this check when launching feature
	if (!isInternal) {
		redirect("/");
	}

	return (
		<div className="flex flex-col grow gap-8">
			<div className="flex flex-col gap-2">
				<Header2>{collection.name}</Header2>
				<Paragraph>{collection.description}</Paragraph>
				<div className="flex gap-2 justify-between items-center">
					<div className="flex gap-2 items-center">
						<Avatar className="size-6 bg-pink-300 border border-gray-100" />
						<Avatar className="-ml-[18px] size-6 bg-pink-300 border border-gray-100" />
						<Avatar className="-ml-[18px] size-6 bg-pink-300 border border-gray-100" />
						<Avatar className="-ml-[18px] size-6 bg-pink-300 border border-gray-100" />
						<div className="text-sm">4 members</div>
					</div>
					<div className="flex gap-4">
						<IconButton>
							<FilePlus02 className="size-[18px] opacity-75" />
						</IconButton>
						<IconButton>
							<Upload01 className="size-[18px] opacity-75" />
						</IconButton>
					</div>
				</div>
			</div>
			<div className="space-y-8">
				{collection.papers.map((paper) => (
					<FeedItem key={paper.id} paper={paper} />
				))}
			</div>
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
	const { filter, features } = getFeatureFilter(fingerprints);
	const titles = params.debug ? await fetchPapersTitles(history) : undefined;

	return { features: filter, days: params.days, titles, all: features };
}
