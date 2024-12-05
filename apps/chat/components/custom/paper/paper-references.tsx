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
		<div className="flex flex-col gap-2 w-full overflow-hidden">
			<div id="refHeader" className="flex flex-col mt-2 gap-4 text-sm text-muted-foreground">

				Relevant research papers
			</div>
			<div id="refList" className="relative w-[300px]">
				<div className="flex overflow-x-scroll pr-[48px] w-[300px] flex-nowrap gap-2 justify-start duration-500 animate-fade-in [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
					{papers.map((paper) => (
						<PaperReference
							key={paper.link}
							paper={paper}
							setOpenedReference={setOpenedReference}
							prefix={prefix}
						/>
					))}
				</div>
				{/* <div className="absolute top-0 right-[-10px] bottom-0 w-12 bg-gradient-to-l from-[#e9ecec] to-transparent pointer-events-none" /> */}
			</div>
		</div>
	);
};
