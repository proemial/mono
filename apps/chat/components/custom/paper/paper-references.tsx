import { OpenReference, ReferencePreview } from "../reference";
import { Dispatch, SetStateAction } from "react";
import { IndexedReferencedPaper } from "../reference-parser";
import PaperReference from "./paper-reference";

type Props = {
	papers: IndexedReferencedPaper<ReferencePreview>[];
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
	prefix: string;
};

export const PaperReferences = ({
	papers,
	setOpenedReference,
	prefix,
}: Props) => {
	return (
		<div className="flex flex-col gap-2 overflow-hidden w-full">
			<div className="flex flex-col mt-2 gap-4 text-sm text-muted-foreground">
				Relevant research papers
			</div>
			<div className="flex gap-4 py-1 min-w-0 overflow-x-scroll w-[calc(100vw-100px)]">
				{papers.map((paper) => (
					<PaperReference
						key={paper.link}
						paper={paper}
						setOpenedReference={setOpenedReference}
						prefix={prefix}
					/>
				))}
			</div>
		</div>
	);
};
