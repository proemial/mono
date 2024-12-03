import { RetrievalResult } from "@/app/(chat)/api/chat/route";

type Props = {
	result: RetrievalResult;
};

export const PaperReferences = ({ result }: Props) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-4 text-muted-foreground">
				Relevant research papers scanned
			</div>
			<div className="flex gap-4 py-1 overflow-x-auto">
				{result.map((paper, index) => (
					<div
						key={paper.link}
						className="flex flex-col gap-2 p-3 border w-[100px] rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-800"
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
