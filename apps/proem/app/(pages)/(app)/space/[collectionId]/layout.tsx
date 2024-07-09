import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { Main } from "@/components/main";
import { ToggleSearchAction } from "@/components/nav-bar/actions/toggle-search-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { findAvailableCollections } from "@proemial/data/repository/collection";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

type PageProps = CollectionIdParams & {
	children: ReactNode;
};

export default async function ({ params, children }: PageProps) {
	const { userId, orgId } = auth();
	if (!params?.collectionId) {
		redirect(routes.space);
	}

	const collectionFromParams = await CollectionService.getCollection(
		params.collectionId,
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

	return (
		<>
			<NavBar action={<ToggleSearchAction />}>
				<SelectSpaceHeader
					collections={[
						// Put the user's default space first
						...combinedCollections.filter((c) => c.id === userId),
						...combinedCollections.filter((c) => c.id !== userId),
					]}
					userId={userId}
				/>
			</NavBar>
			<Main>{children}</Main>
		</>
	);
}
