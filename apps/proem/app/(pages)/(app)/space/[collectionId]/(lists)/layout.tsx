import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { TabBar } from "@/app/(pages)/(app)/space/[collectionId]/tab-bar";
import { LoadingTransition } from "@/components/loading-transition";
import Markdown from "@/components/markdown";
import { OnboardingCarousel } from "@/components/onboarding";
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
		<div className="flex flex-col gap-2.5 grow group">
			{!isDefaultCollection && (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<div className="break-words markdown">
							<Markdown>{collection.description ?? ""}</Markdown>
						</div>
					</div>
					<div className="flex items-center justify-between gap-2 mb-2">
						<SpaceContributorsIndicator collection={collection} />
						<SpaceShareIndicator
							shared={collection.shared}
							organisationId={orgId}
						/>
					</div>

					<TabBar
						tabs={[
							{ href: `${routes.space}/${collection.id}`, title: "Latest" },
							{
								href: `${routes.space}/${collection.id}/saved`,
								title: "Saved",
							},
						]}
					/>
				</div>
			)}

			{isDefaultCollection && <OnboardingCarousel />}

			{/* {isDefaultCollection && <div>Show stuff on discover for logged in user</div>} */}
			<LoadingTransition type="section">{children}</LoadingTransition>
		</div>
	);
}
