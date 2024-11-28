import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { PaperReadsService } from "@/services/paper-reads-service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CollectionIdParams } from "../../../params";

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

	void PaperReadsService.increment(paperId);
	return (
		<PaperPage
			paperId={paperId}
			type="oa"
			collectionId={collectionId}
			source="spaces"
		/>
	);
}
