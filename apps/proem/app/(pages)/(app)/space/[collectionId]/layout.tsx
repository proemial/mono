import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { Main } from "@/components/main";
import { ToggleSearchAction } from "@/components/nav-bar/actions/toggle-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { getActiveSpace } from "@/components/nav-bar/headers/active-space";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { Theme } from "@/components/theme";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { findAvailableCollections } from "@proemial/data/repository/collection";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type PageProps = CollectionIdParams & {
	children: ReactNode;
};

export default async function ({
	params: { collectionId },
	children,
}: PageProps) {
	const { userId, orgId } = auth();

	const collectionFromParams = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collectionFromParams) {
		notFound();
	}

	const availableCollections = userId
		? await findAvailableCollections(userId, orgId)
		: [];
	const containsCollection = availableCollections.some(
		(c) => c.id === collectionFromParams.id,
	);
	const combinedCollections = containsCollection
		? availableCollections
		: [...availableCollections, collectionFromParams].sort((a, b) =>
				a.name.localeCompare(b.name),
			);

	const activeSpace = getActiveSpace(
		combinedCollections,
		userId,
		collectionId,
	).activeSpace;
	const seed = activeSpace?.name ?? "";

	const isDefaultCollection = activeSpace?.id === userId;

	return (
		<>
			<Theme.headers.top seed={seed} unstyled={isDefaultCollection}>
				<NavBar action={<ToggleSearchAction />}>
					<SelectSpaceHeader
						collections={[
							// Put the user's default space first
							...combinedCollections.filter((c) => c.id === userId),
							...combinedCollections.filter((c) => c.id !== userId),
						]}
						userId={userId}
						collectionId={collectionId}
					/>
				</NavBar>
			</Theme.headers.top>
			<Main>{children}</Main>
		</>
	);
}
