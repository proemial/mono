import { fetchPaper } from "@/app/(pages)/(app)/discover/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/discover/[id]/generate-starters";
import { PaperReader } from "@/app/(pages)/(app)/discover/[id]/paper-reader";
import { notFound } from "next/navigation";

type Props = {
	params: { id: string };
	searchParams: { title?: string };
};

export default async function ReaderPage({ params }: Props) {
	const paper = await fetchPaper(params.id);

	if (!paper) {
		notFound();
	}

	const starters = paper.generated?.starters ?? (await generate(paper));

	return <PaperReader paper={paper} starters={starters} />;
}
