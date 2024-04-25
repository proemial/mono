import { Trackable } from "@/components/trackable";
import { Header2, Header4, Header5, Paragraph } from "@proemial/shadcn-ui";
import { AlignLeft } from "./icons/AlignLeft";
import { ModelSelector } from "./model-selector";

type ChatArticleProps = {
	type: "Answer" | "Summary";
	headline?: string;
	text?: string;
	trackingKey?: string;
};

export function ChatArticle({
	headline,
	type,
	text,
	trackingKey,
}: ChatArticleProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<AlignLeft />
					<Header4>{type}</Header4>
				</div>
				<div className="flex flex-grow justify-end -mr-2">
					<Trackable trackingKey={trackingKey}>
						<ModelSelector className="w-full" />
					</Trackable>
				</div>
			</div>

			{headline ? <Header2>{headline}</Header2> : null}
			<Paragraph>{text}</Paragraph>
		</div>
	);
}
