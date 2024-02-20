"use client";
import { CardFooter } from "@/app/components/card/footer";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import { useFeatureFlags } from "@/app/components/feature-flags/client-flags";
import { Features } from "@/app/components/feature-flags/features";
import { usePaperState } from "@/app/components/login/state";
import {
	OpenAlexLocation,
	OpenAlexPaper,
	OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { ReactNode, useEffect } from "react";

type Props = {
	id: string;
	paper: OpenAlexPaper;
	children: ReactNode;
};

export function ReaderPaper({ children, paper, id }: Props) {
	const { setLatest } = usePaperState();

	useEffect(() => {
		setLatest(id);
	}, [id]);

	const data = paper.data as OpenAlexWorkMetadata;

	const flags = useFeatureFlags([
		Features.showMainTopicInCards,
		Features.showSubfieldInCards,
		Features.hideConceptsInCards,
		Features.showJournalInCards,
		Features.showOrgInCards,
	]);

	return (
		// <div className="flex px-6 pb-6 pt-2 bg-[#1A1A1A] flex-col before:absolute before:-inset-0 relative before:top-[-100%] before:bg-[#1A1A1A] before:-z-10 border-b shadow border-[#4E4E4E] w-full">
		<PaperCard className="py-1">
			<PaperCardTop size="lg" date={paper.data.publication_date} />
			<PaperCardTitle size={"lg"}>{children}</PaperCardTitle>

			<div className="mt-1 text-xs text-white/50 font-sourceCodePro">
				{paperSource(paper.data.primary_location)}
			</div>

			<CardFooter data={data} flags={flags} />
		</PaperCard>
		// </div>
	);
}

function paperSource(location: OpenAlexLocation) {
	const org = location?.source?.host_organization_name;
	const journal = location?.source?.display_name;

	const isArXiv = journal?.toLowerCase().includes("arxiv");
	const isElsevier = org?.toLowerCase().includes("elsevier"); // TODO: Validate that it works

	return isArXiv || isElsevier ? journal : org;
}
