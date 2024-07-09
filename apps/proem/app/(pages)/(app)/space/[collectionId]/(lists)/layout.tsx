import { NavItem } from "@/app/(pages)/(app)/space/[collectionId]/nav-item";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { getPersonalDefaultCollection } from "@/app/constants";
import { SpaceContributorsIndicator } from "@/components/space-contributors-indicator";
import { SpaceShareIndicator } from "@/components/space-share-indicator";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { findCollectionWithBookmarksById } from "@proemial/data/repository/collection";
import { Paragraph } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = CollectionIdParams & {
	children: ReactNode;
};
export default async function ({ params, children }: Props) {
	const { userId } = auth();
	if (!userId || !params?.collectionId) {
		redirect(routes.space);
	}

	const collection = await getCollection(params.collectionId, userId);
	if (!collection) {
		redirect(routes.space);
	}

	const isDefaultCollection = collection.id === userId;
	return (
		<div className="flex flex-col gap-2 grow">
			<div className="flex flex-col gap-3">
				{!isDefaultCollection && (
					<Paragraph>{collection.description}</Paragraph>
				)}
				<div className="flex items-center justify-between gap-2">
					<SpaceContributorsIndicator collection={collection} />
					<SpaceShareIndicator shared={collection.shared} />
				</div>
			</div>
			<div className="flex items-center justify-center gap-1">
				<NavItem href={`${routes.space}/${collection.id}`} title="Latest" />
				<NavItem
					href={`${routes.space}/${collection.id}/saved`}
					title="Saved"
				/>
			</div>
			{children}
		</div>
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
