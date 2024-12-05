import { ActiveReference, ReferencePreview } from "../reference";
import { Dispatch, SetStateAction } from "react";
import { IndexedReferencedPaper } from "../reference-parser";

type Props = {
	papers: IndexedReferencedPaper<ReferencePreview>[];
	setSelectedReference: Dispatch<SetStateAction<ActiveReference>>;
};

export const PaperReferences = ({ papers, setSelectedReference }: Props) => {
	return (
		<div className="flex flex-col gap-2 overflow-hidden w-full">
			<div className="flex flex-col mt-2 gap-4 text-sm text-muted-foreground">
				Relevant research papers
			</div>
			<div className="flex gap-4 py-1 min-w-0 overflow-x-scroll w-[calc(100vw-100px)]">
				{papers.map((paper) => (
					<div
						key={paper.link}
						className="flex flex-col gap-2 p-3 border w-[100px] rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-800 cursor-pointer"
						onClick={(event) => {
							const rect = event.currentTarget.getBoundingClientRect();

							setSelectedReference({
								preview: paper,
								isVisible: true,
								boundingBox: {
									top: rect.top,
									left: rect.left,
									width: rect.width,
									height: rect.height,
								},
							});
						}}
					>
						<div className="text-xs text-sidebar-foreground/50 text-center">
							{paper.index + 1}
						</div>
						<div className="line-clamp-5 text-sm">{paper.title}</div>
					</div>
				))}
			</div>
		</div>
	);
};
