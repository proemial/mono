import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { PaperReadsService } from "@/services/paper-reads-service";

type Props = {
	params: { id: string };
};

export default async function ArXivPaperPage({ params }: Props) {
	void PaperReadsService.add(params.id);
	return <PaperPage paperId={params.id} type="arxiv" />;
}
