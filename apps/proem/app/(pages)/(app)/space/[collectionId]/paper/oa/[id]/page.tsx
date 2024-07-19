import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CollectionIdParams } from "../../../params";
import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { Theme } from "@/components/theme";

type Props = CollectionIdParams & {
	params: { id: string };
};

export default async function OAPaperPage({
	params: { collectionId, id: paperId },
}: Props) {
	const { userId, orgId } = auth();

	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		// If no space permissions, reopen paper in unspaced Reader
		redirect(`${routes.paper}/oa/${paperId}`);
	}

	const paper = await fetchPaper(paperId);
	const title = paper?.generated?.title ?? paper?.data?.title;
	const isDefaultCollection = collection?.id === userId;

	return (
		<>
			<div className="mt-[-16px] mx-[-16px]">
				<Theme.headers.bottom
					seed={collection.name}
					unstyled={isDefaultCollection}
				>
					{title}
				</Theme.headers.bottom>
			</div>
			<PaperPage paperId={paperId} type="oa" collectionId={collectionId} />
		</>
	);
}
