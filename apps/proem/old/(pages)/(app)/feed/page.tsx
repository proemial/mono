import { CardList } from "@/app/components/card/card-list";
import { DragScrollContainer } from "@/app/components/drag-scroll";
import { CenteredSpinner } from "@/app/components/loading/spinner";
import { TabNavigation } from "@/app/components/proem-ui/tab-navigation";
import { fetchLatestPapers } from "@/old/(pages)/(app)/oa/[id]/fetch-paper";
import { OaTopics } from "@proemial/models/open-alex-topics";
import { Suspense } from "react";
import { PageLayout } from "../page-layout";

export const revalidate = 1;

const pageName = "feed";

export const metadata = {
	title: `proem - ${pageName}`,
};

export default async function FeedPage() {
	const papers = await fetchLatestPapers();

	return (
		<PageLayout title={pageName}>
			<>
				<DragScrollContainer className="flex justify-center my-4">
					<TabNavigation
						items={[
							"all",
							...OaTopics.map((concept) => concept.display_name.toLowerCase()),
						]}
						rootPath="/feed"
					/>
				</DragScrollContainer>
				<Suspense fallback={<CenteredSpinner />}>
					<CardList papers={papers} />
				</Suspense>
			</>
		</PageLayout>
	);
}
