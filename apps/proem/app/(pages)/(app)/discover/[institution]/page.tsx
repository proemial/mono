import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ProemAssistant } from "@/components/proem-assistant";
import { auth } from "@clerk/nextjs/server";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";
import { fetchJson } from "@proemial/utils/fetch";
import { getRandomThemeColor, Theme } from "@/app/theme/color-theme";
import { OrgSelector } from "./org-selector";
import { Button, cn } from "@proemial/shadcn-ui";
import { FollowButton } from "./follow";

const themeMappings: { [name: string]: Theme } = {
	nvidia: { color: "green", image: "silicon" },
	zeiss: { color: "purple", image: "fingerprint" },
	novo: { color: "purple", image: "fingerprint" },
	google: { color: "gold", image: "silicon" },
};

function themeFor(institution: string): Theme {
	return Object.keys(themeMappings).includes(institution)
		? (themeMappings[institution as keyof typeof themeMappings] as Theme)
		: getRandomThemeColor(institution);
}

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
	const shortName = name.split("(")[0] ?? name;

	const header = (
		<div className="mt-2 flex flex-row justify-between items-center">
			{institutions?.at(0)?.works_count} papers published
			<FollowButton id={institutions?.at(0)?.id as string} />
		</div>
	);

	return (
		<>
			<NavBar action={<OpenSearchAction />} theme={themeFor(institution)}>
				<SimpleHeader title={shortName} />
			</NavBar>
			<Main className="z-0">
				<div className="pt-16 space-y-6">
					{institutions?.length > 0 && (
						<Feed
							filter={{ institution: institutions.at(0)?.id }}
							bookmarks={bookmarks}
							header={header}
						>
							<OrgSelector institutions={institutions} selected={name} />
						</Feed>
					)}
				</div>
			</Main>
			<ProemAssistant />
		</>
	);
}
