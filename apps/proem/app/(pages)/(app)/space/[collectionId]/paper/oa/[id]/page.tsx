import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
	params: { id: string; collectionId: string };
};

export default async function OAPaperPage({ params }: Props) {
	const { userId, orgId } = auth();

	const collection = await CollectionService.getCollection(
		params.collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		// If no space permissions, reopen paper in unspaced Reader
		redirect(`${routes.paper}/oa/${params.id}`);
	}

	return (
		<PaperPage
			paperId={params.id}
			type="oa"
			collectionId={params.collectionId}
		/>
	);
}
