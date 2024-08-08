import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ProemAssistant } from "@/components/proem-assistant";
import { auth } from "@clerk/nextjs/server";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";
import { fetchJson } from "@proemial/utils/fetch";
import Link from "next/link";
import { getRandomThemeColor, Theme } from "@/app/theme/color-theme";

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

	const institutions = await fetchJson<InstitutionResponse>(
		`https://api.openalex.org/institutions?filter=display_name.search:${institution}&select=id,display_name,works_count,counts_by_year`,
	);

	return (
		<>
			<NavBar action={<OpenSearchAction />} theme={themeFor(institution)}>
				<SimpleHeader
					title={institutions?.results.at(0)?.display_name ?? institution}
				/>
			</NavBar>
			<Main className="z-0">
				<div className="pt-16 space-y-6">
					{institutions?.results?.length > 0 && (
						<Feed
							filter={{ institution: institutions.results.at(0)?.id }}
							bookmarks={bookmarks}
						>
							<div>
								<>
									{institutions?.results?.length > 0 && (
										<div>
											{institutions.results.at(0)?.works_count.toLocaleString()}{" "}
											papers authored by individuals affiliated with{" "}
											<span className="font-bold italic">
												{institutions.results.at(0)?.display_name}
											</span>
										</div>
									)}
									{institutions?.results?.length > 1 && (
										<div className="text-xs">
											Did you mean:
											{institutions.results.slice(1).map((institution) => (
												<Link
													key={institution.id}
													href={`/discover/${institution.display_name}`}
													className="text-blue-500 underline ml-1"
												>
													{`${institution.display_name}`}
													{/* 
														{`${institution.display_name} (${
															institution.counts_by_year
																.filter((o) => o.year === 2024)
																.at(0)?.works_count
														} / ${institution.works_count})`}
													 */}
												</Link>
											))}
										</div>
									)}
								</>
							</div>
						</Feed>
					)}
				</div>
			</Main>
			<ProemAssistant />
		</>
	);
}
