import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { PaperReadsService } from "@/services/paper-reads-service";
import { ProemAssistant } from "@/components/proem-assistant/assistant";
import { Header } from "@/app/(pages)/news/components/header";
import { Footer } from "../../../components/footer";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	void PaperReadsService.increment(params.id);
	return (
		<div className="w-full bg-[#F7F7F7]">
			<Header />
			<div className="p-4 min-h-[100vh]">
				<PaperPage paperId={params.id} type="oa" />
				<ProemAssistant />
			</div>
			<Footer />
		</div>
	);
}
