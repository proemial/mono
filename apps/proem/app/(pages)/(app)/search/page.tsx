import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { routes } from "@/routes";
import { Suspense } from "react";
import { findPapers } from "./find-papers";
import { Paper } from "./paper";
import { SearchForm } from "./search-form";

type Props = {
	searchParams?: {
		query: string;
	};
};

export default async function SearchPage({ searchParams }: Props) {
	const { query } = searchParams ?? { query: undefined };
	const papers = query ? await findPapers(query) : { results: [] };
	const { isInternal } = getInternalUser();

	return (
		<>
			<NavBarV2
				action={<CloseAction target={routes.discover} />}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Search" />
			</NavBarV2>
			<Main>
				<div className="space-y-6">
					<SearchForm
						placeholder="Search for a paper title"
						trackingPrefix="search"
						value={query}
					/>
					<div className="space-y-4">
						{papers.results.map((paper, i) => (
							<Paper key={i} paper={paper} />
						))}
					</div>
				</div>
			</Main>
		</>
	);
}
