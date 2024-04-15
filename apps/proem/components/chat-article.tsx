import { Header2, Header4, Header5, Paragraph } from "@proemial/shadcn-ui";
import { AlignLeft } from "lucide-react";

type ChatArticleProps = {
	type: string;
	model: string;
	headline?: string;
	text?: string;
};

export function ChatArticle({ headline, type, model, text }: ChatArticleProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<AlignLeft className="size-4" />
					<Header4>{type}</Header4>
				</div>
				<div>
					<Header5>{model}</Header5>
				</div>
			</div>

			{headline ? <Header2>{headline}</Header2> : null}
			<Paragraph>{text}</Paragraph>
		</div>
	);
}
