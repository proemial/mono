import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { fetchFeedByInstitutionWithPostsAndReaders } from "@/app/(pages)/(app)/space/(discover)/fetch-feed";
import {
	Branding,
	brandingForInstitution,
} from "@/app/theme/institution-branding";
import { getQueryClient } from "@/components/providers/get-query-client";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { auth } from "@clerk/nextjs/server";
import {
	Institution,
	fetchInstitutions,
} from "@proemial/repositories/oa/institutions/fetch-institutions";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";
import { FollowButton } from "./follow";
import { OrgSelector } from "./org-selector";

export default async function DiscoverPage({
	params,
}: {
	params: {
		institution: string;
	};
}) {
	const { userId } = auth();
	const { institution: searchString } = params;

	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	const institutions = await fetchInstitutions(searchString);
	const institution = institutions?.at(0)!;
	const institutionName = institution?.display_name ?? searchString;

	const filter = { institution: institution?.id };

	const getFeed = async () => {
		const feed = await fetchFeedByInstitutionWithPostsAndReaders(
			{ id: filter.institution },
			{ offset: 1 },
			undefined,
		);

		return asInfiniteQueryData(feed);
	};
	const header = (
		<div className="mt-2 flex flex-row justify-between items-center">
			<WorksCount institution={institution} />
			<FollowButton
				id={institution?.id as string}
				name={institution?.display_name ?? searchString}
			/>
		</div>
	);

	const branding = brandingForInstitution(searchString);

	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(filter),
		queryFn: getFeed,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Logo name={institutionName} branding={branding} />

			{institutions?.length > 0 && (
				<Feed
					filter={filter}
					bookmarks={bookmarks}
					theme={branding.theme}
					header={header}
				>
					<OrgSelector institutions={institutions} selected={institutionName} />
				</Feed>
			)}
		</HydrationBoundary>
	);
}

function WorksCount({ institution }: { institution?: Institution }) {
	const thisYear = institution?.counts_by_year.find(
		(works) => works.year === 2024,
	)?.works_count;
	if (thisYear) {
		return <>{thisYear.toLocaleString()} papers published this year</>;
	}
	return <>{institution?.works_count?.toLocaleString()} papers published</>;
}

function Logo({ name, branding }: { name: string; branding: Branding }) {
	if (!branding.logo)
		return <div className="mb-12 flex justify-center text-xl">{name}</div>;

	// mix-blend-mode works but not on our background https://codepen.io/summercodes/pen/eYaYoVO
	return (
		<div className="mb-8 flex justify-center">
			<img
				src={branding.logo.url}
				alt=""
				className={`max-h-24 max-w-[60%] ${
					branding.logo.whiteOnBlack ? "mix-blend-multiply" : ""
				}`}
			/>
		</div>
	);
	// return (
	// 	<div
	// 		className="h-24 mb-8 bg-contain bg-no-repeat bg-center"
	// 		style={{
	// 			backgroundImage: `url("${branding.logo.url}")`,
	// 		}}
	// 	/>
	// );
}
