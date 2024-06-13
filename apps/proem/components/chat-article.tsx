import { MicroAbstract } from "@/components/chat-abstract";
import { AlignLeft } from "@/components/icons/AlignLeft";
import { ModelSelector, ModelSelectorProps } from "@/components/model-selector";
import { Trackable } from "@/components/trackable";
import { trimForQuotes } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Header2, Header4, Icons, Paragraph } from "@proemial/shadcn-ui";
import { Suspense } from "react";

type ChatArticleProps = {
	type: "Answer" | "Summary";
	trackingKeys: ModelSelectorProps["trackingKeys"];
	text?: string;
	paper?: OpenAlexPaper;
};

export function ChatArticle({
	type,
	trackingKeys,
	text,
	paper,
}: ChatArticleProps) {
	const title = paper?.generated?.title;

	return (
		<div className="space-y-3 text-pretty">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-3.5">
					<AlignLeft />
					<Header4>{type}</Header4>
				</div>
				<div className="flex justify-end flex-grow -mr-2">
					<Trackable trackingKey={trackingKeys.click.model}>
						<ModelSelector className="w-full" trackingKeys={trackingKeys} />
					</Trackable>
				</div>
			</div>

			{title ? <Title title={title} /> : null}

			{text && <Paragraph>{text}</Paragraph>}

			{paper && (
				<Suspense fallback={<Spinner />}>
					<MicroAbstract paper={paper} />
				</Suspense>
			)}
		</div>
	);
}

function Title({ title }: { title: string }) {
	// Remove potential leading/trailing quotes from the title
	return <Header2>{trimForQuotes(title)}</Header2>;
}

function Spinner() {
	return (
		<div className="flex items-center justify-center mx-auto size-24">
			<Icons.loader />
		</div>
	);
}
