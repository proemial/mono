import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { ProemAssistant } from "@/components/proem-assistant";
import { auth } from "@clerk/nextjs/server";
import { fetchJson } from "@proemial/utils/fetch";
import { FollowButton } from "./follow";
import { OrgSelector } from "./org-selector";

import { themeForInstitution } from "@/app/theme/color-theme";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";

export default async function DiscoverPage({
	params,
}: {
	params: {
		institution: string;
	};
}) {
	const { userId } = auth();
	const { institution } = params;

	const bookmarks = (await userId)
		? getBookmarksByCollectionId(userId as string)
		: {};

	type Institution = {
		id: string;
		display_name: string;
		works_count: number;
		counts_by_year: Record<string, number>[];
	};

	type InstitutionResponse = {
		results: Institution[];
	};

	const institutions = (
		await fetchJson<InstitutionResponse>(
			`https://api.openalex.org/institutions?filter=display_name.search:${institution}&select=id,display_name,works_count,counts_by_year`,
		)
	).results.sort((a, b) => b.works_count - a.works_count);

	const name = institutions?.at(0)?.display_name ?? institution;

	const header = (
		<div className="mt-2 flex flex-row justify-between items-center">
			{institutions?.at(0)?.works_count} papers published
			<FollowButton id={institutions?.at(0)?.id as string} />
		</div>
	);
	const theme = themeForInstitution(institution);

	return (
		<>
			<div className="pt-10">
				{institutions?.length > 0 && (
					<Feed
						filter={{ institution: institutions.at(0)?.id }}
						bookmarks={bookmarks}
						theme={theme}
						header={header}
					>
						<OrgSelector institutions={institutions} selected={name} />
					</Feed>
				)}
			</div>
			<ProemAssistant />
		</>
	);
}
