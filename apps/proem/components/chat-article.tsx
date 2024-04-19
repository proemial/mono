import { Header4, Header5 } from "@proemial/shadcn-ui";
import { AlignLeft } from "./icons/AlignLeft";


type ChatArticleProps = {
	type: "Answer" | "Summary";
	model: string;
	children: React.ReactNode;
};

export function ChatArticle({ type, model, children }: ChatArticleProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<AlignLeft />
					<Header4>{type}</Header4>
				</div>
				<div>
					<Header5>{model}</Header5>
				</div>
			</div>

			{children}
		</div>
	);
}
