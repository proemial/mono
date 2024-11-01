import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { PaperReadsService } from "@/services/paper-reads-service";
import { Header } from "@/app/(experiments)/news/components/header";
import { Footer } from "@/app/(experiments)/news/components/footer";
import { ProemAssistant } from "@/components/proem-assistant/assistant";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	void PaperReadsService.increment(params.id);
	return (
		<div className="bg-[#F7F7F7]">
			<Header />
			<div className="p-4 min-h-[100vh]">
				<PaperPage paperId={params.id} type="oa" />
				<ProemAssistant />
			</div>
			<Footer />
		</div>
	);
}
