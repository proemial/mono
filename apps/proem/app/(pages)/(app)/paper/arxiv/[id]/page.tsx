import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";

type Props = {
	params: { id: string };
};

export default async function ArXivPaperPage({ params }: Props) {
	return <PaperPage paperId={params.id} type="arxiv" />;
}
