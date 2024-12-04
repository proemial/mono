import { RetrievalResult } from "@/app/(chat)/api/chat/route";
import { ActiveReference, ReferencePreview } from "./reference";
import { Dispatch, SetStateAction } from "react";

type Props = {
	result: RetrievalResult;
	setSelectedReference: Dispatch<SetStateAction<ActiveReference>>;
};

export const PaperReferences = ({ result, setSelectedReference }: Props) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-4 text-muted-foreground">
				Relevant research papers scanned
			</div>
			<div className="flex gap-4 py-1 overflow-x-auto">
				{result.slice(0, 2).map((paper, index) => (
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
							{index + 1}
						</div>
						<div className="line-clamp-5 text-sm">{paper.title}</div>
					</div>
				))}
			</div>
		</div>
	);
};
