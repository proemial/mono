import { getPersonalDefaultCollection } from "@/app/constants";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { findCollectionsByOwnerId } from "@proemial/data/repository/collection";
import PaperPage from "./paper-page";
import { Theme } from "@/components/theme";
import { fetchPaper } from "./fetch-paper";
import { Collection } from "@proemial/data/neon/schema";
import { Header2 } from "@proemial/shadcn-ui";
import Markdown from "@/components/markdown";
import { trimForQuotes } from "@/utils/string-utils";
import { getActiveSpace } from "@/components/nav-bar/headers/active-space";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	const { userId } = auth();
	const userCollections = userId ? await findCollectionsByOwnerId(userId) : [];

	const paper = await fetchPaper(params.id);
	const title = paper?.generated?.title ?? paper?.data?.title;

	const { activeSpace } = getActiveSpace(userCollections, userId);
	const seed = activeSpace?.name ?? "";
	const isDefaultCollection = activeSpace?.id === userId;

	return (
		<>
			<Theme.headers.top seed={seed} unstyled={isDefaultCollection}>
				<NavBar action={<CloseAction target={routes.space} />}>
					{userCollections.length > 0 ? (
						<SelectSpaceHeader collections={userCollections} userId={userId} />
					) : (
						<SimpleHeader title="For You" />
					)}
				</NavBar>
			</Theme.headers.top>
			<Theme.headers.bottom seed={seed} unstyled={isDefaultCollection}>
				{title && <Title title={title} />}
			</Theme.headers.bottom>
			<Main>
				<PaperPage paperId={params.id} type="oa" />
			</Main>
		</>
	);
}

function Title({ title }: { title: string }) {
	// Remove potential leading/trailing quotes from the title
	return (
		<Header2>
			<Markdown>{trimForQuotes(title)}</Markdown>
		</Header2>
	);
}
