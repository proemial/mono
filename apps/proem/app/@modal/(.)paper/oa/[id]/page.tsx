import ReaderPage from "@/app/(pages)/(app)/paper/oa/[id]/page";
import { PageDrawer } from "@/components/full-page-drawer";

type ReaderModalProps = {
	params: { id: string };
};
export default async function ReaderModal({
	params: { id: paperId },
}: ReaderModalProps) {
	return (
		<PageDrawer>
			<ReaderPage params={{ id: paperId }} />
		</PageDrawer>
	);
}
