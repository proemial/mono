import { Trackable } from "@/components/trackable";
import { Header2, Header4, Icons, Paragraph } from "@proemial/shadcn-ui";
import { AlignLeft } from "./icons/AlignLeft";
import { ModelSelector } from "./model-selector";
import { Suspense } from "react";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { MicroAbstract } from "./chat-abstract";

type ChatArticleProps = {
	type: "Answer" | "Summary";
	trackingKey: string;
	title?: string;
	paper?: OpenAlexPaper;
};

export function ChatArticle({
	type,
	trackingKey,
	title,
	paper,
}: ChatArticleProps) {
	const paperTitle = title || paper?.generated?.title;

	return (
		<div className="space-y-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-3">
					<AlignLeft />
					<Header4>{type}</Header4>
				</div>
				<div className="flex justify-end flex-grow -mr-2">
					<Trackable trackingKey={trackingKey}>
						<ModelSelector className="w-full" trackingKey={trackingKey} />
					</Trackable>
				</div>
			</div>

			{paperTitle ? <Header2>{paperTitle}</Header2> : null}

			{paper && (
				<Suspense fallback={<Spinner />}>
					<MicroAbstract paper={paper} />
				</Suspense>
			)}
		</div>
	);
}

function Spinner() {
	return (
		<div className="flex items-center justify-center mx-auto size-24">
			<Icons.loader />
		</div>
	);
}
