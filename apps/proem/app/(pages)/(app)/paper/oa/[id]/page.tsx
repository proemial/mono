import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { PaperReadsService } from "@/services/paper-reads-service";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	void PaperReadsService.registerPaperRead(params.id);
	return <PaperPage paperId={params.id} type="oa" />;
}
