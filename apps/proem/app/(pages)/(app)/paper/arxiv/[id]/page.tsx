import PaperPage from "@/app/(pages)/(app)/paper/oa/[id]/paper-page";
import { Main } from "@/components/main";

type Props = {
	params: { id: string };
};

export default async function ArXivPaperPage({ params }: Props) {
	return (
		<Main>
			<PaperPage paperId={params.id} type="arxiv" />
		</Main>
	);
}
