import { NavItem } from "@/app/(pages)/(app)/space/[collectionId]/nav-item";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import Markdown from "@/components/markdown";
import { SpaceContributorsIndicator } from "@/components/space-contributors-indicator";
import { SpaceShareIndicator } from "@/components/space-share-indicator";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { Header2 } from "@proemial/shadcn-ui";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type Props = CollectionIdParams & {
	children: ReactNode;
};
export default async function ({ params: { collectionId }, children }: Props) {
	const { userId, orgId } = auth();
	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);

	if (!collection) {
		notFound();
	}

	const isDefaultCollection = collection.id === userId;

	return (
		<div className="flex flex-col gap-5 grow pt-10">
			{!isDefaultCollection && (
				<div className="flex flex-col gap-2">
					<div className="flex flex-col gap-3">
						<Header2 className="break-words markdown">
							<Markdown>{collection.description ?? ""}</Markdown>
						</Header2>

						<div className="flex items-center justify-between gap-2">
							<SpaceContributorsIndicator collection={collection} />
							<SpaceShareIndicator shared={collection.shared} />
						</div>
					</div>

					{/* TODO! left align if navItem contains over 2 */}
					<div className="flex items-center justify-center gap-2">
						<NavItem href={`${routes.space}/${collection.id}`} title="Latest" />
						<NavItem
							href={`${routes.space}/${collection.id}/saved`}
							title="Saved"
						/>
					</div>
				</div>
			)}

			{children}
		</div>
	);
}
