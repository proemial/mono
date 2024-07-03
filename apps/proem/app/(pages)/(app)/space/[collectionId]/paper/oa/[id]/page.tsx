import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { isPublicSpace } from "@proemial/data/lib/create-id";
import { redirect } from "next/navigation";

type Props = {
	params: { id: string; collectionId: string };
};

export default async function OAPaperPage({ params }: Props) {
	const { userId } = auth();
	// Disallow access to other users' default space, but reopen paper in unspaced Reader
	if (params.collectionId !== userId && !isPublicSpace(params.collectionId)) {
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
