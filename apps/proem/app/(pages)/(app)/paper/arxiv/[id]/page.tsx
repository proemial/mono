import PaperPage from "../../oa/[id]/paper-page";

type Props = {
	params: { id: string };
};

export default async function OAPaperPage({ params }: Props) {
	return <PaperPage paperId={params.id} type="arxiv" />;
}
