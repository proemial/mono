import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { getPersonalDefaultCollection } from "@/app/constants";
import { Main } from "@/components/main";
import { ToggleSearchAction } from "@/components/nav-bar/actions/toggle-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import {
	findAvailableCollections,
	findCollectionWithBookmarksById,
} from "@proemial/data/repository/collection";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type PageProps = CollectionIdParams & {
	children: ReactNode;
};

export default async function ({ params, children }: PageProps) {
	const { userId, orgId } = auth();
	if (!userId || !params?.collectionId) {
		redirect(routes.space);
	}

	const collection = await getCollection(params.collectionId, userId);
	if (!collection) {
		redirect(routes.space);
	}

	const userCollections = await findAvailableCollections(userId, orgId);

	return (
		<>
			<NavBar action={<ToggleSearchAction />}>
				<SelectSpaceHeader collections={userCollections} userId={userId} />
			</NavBar>
			<Main>{children}</Main>
		</>
	);
}

const getCollection = async (collectionId: string, userId: string) => {
	const collection = await findCollectionWithBookmarksById(collectionId);
	if (collection) {
		return collection;
	}
	if (collectionId === userId) {
		return getPersonalDefaultCollection(userId);
	}
	return undefined;
};
