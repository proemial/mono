import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";

type Props = {
	params: { id: string; collectionId: string };
};

export default async function OAPaperPage({ params }: Props) {
	return (
		<PaperPage
			paperId={params.id}
			type="oa"
			collectionId={params.collectionId}
		/>
	);
}
