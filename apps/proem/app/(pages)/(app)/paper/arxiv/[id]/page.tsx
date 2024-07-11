import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { findCollectionsByOwnerId } from "@proemial/data/repository/collection";
import PaperPage from "../../oa/[id]/paper-page";

type Props = {
	params: { id: string };
};

export default async function ArXivPaperPage({ params }: Props) {
	const { userId } = auth();
	const userCollections = userId ? await findCollectionsByOwnerId(userId) : [];

	return (
		<>
			<NavBar action={<CloseAction target={routes.space} />}>
				{userCollections.length > 0 ? (
					<SelectSpaceHeader collections={userCollections} userId={userId} />
				) : (
					<SimpleHeader title="For You" />
				)}
			</NavBar>
			<Main>
				<PaperPage paperId={params.id} type="arxiv" />
			</Main>
		</>
	);
}
