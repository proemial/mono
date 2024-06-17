import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { PageDrawer } from "@/components/full-page-drawer";

type ReaderModalProps = {
	params: { id: string };
};
export default async function ArXivPaperModal({
	params: { id: paperId },
}: ReaderModalProps) {
	return (
		<PageDrawer>
			<PaperPage paperId={paperId} type="arxiv" />
		</PageDrawer>
	);
}
