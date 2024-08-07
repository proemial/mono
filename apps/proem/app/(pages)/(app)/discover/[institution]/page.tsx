import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { Main } from "@/components/main";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ProemAssistant } from "@/components/proem-assistant";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBookmarksByCollectionId } from "../../space/(discover)/get-bookmarks-by-collection-id";
import { fetchJson } from "@proemial/utils/fetch";
import { FeatureBadge } from "@/components/feature-badges";
import { Badge } from "@proemial/shadcn-ui/components/ui/badge";
import Link from "next/link";

export default async function DiscoverPage({
	params,
}: {
	params: {
		institution: string;
	};
}) {
	const { userId } = auth();

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
		`https://api.openalex.org/institutions?filter=display_name.search:${params.institution}&select=id,display_name,works_count,counts_by_year`,
	);

	return (
		<>
			<NavBar action={<OpenSearchAction />}>
				<SimpleHeader title="For You" />
			</NavBar>
			<Main>
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
											Showing{" "}
											{institutions.results.at(0)?.works_count.toLocaleString()}{" "}
											papers from {institutions.results.at(0)?.display_name}
										</div>
									)}
									{institutions?.results?.length > 1 && (
										<div className="text-xs italic">
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
