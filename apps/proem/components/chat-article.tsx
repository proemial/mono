import { MicroAbstract } from "@/components/chat-abstract";
import { AIGeneratedIcon } from "@/components/icons/AIGeneratedIcon";
import { ModelSelector, ModelSelectorProps } from "@/components/model-selector";
import { Trackable } from "@/components/trackable";
import { trimForQuotes } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Header2, Header4, Icons } from "@proemial/shadcn-ui";
import { Users01 } from "@untitled-ui/icons-react";
import { Suspense } from "react";
import Markdown from "./markdown";

type ChatArticleProps = {
	type: "Answer" | "Paper Summary";
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
	const authors = paper?.data.authorships;

	return (
		<div className="space-y-3 text-pretty">
			{title ? <Title title={title} /> : null}

			{authors ? (
				<div className="flex items-center gap-2.5 opacity-50 pr-1.5">
					<Users01 className="size-3" />
					<span className="truncate text-[10px] uppercase">
						{authors.map((author) => author.author.display_name).join(", ")}
					</span>
				</div>
			) : null}

			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-2.5 gap">
					<AIGeneratedIcon />
					<Header4>{type}</Header4>
				</div>
				<div className="flex justify-end flex-grow -mr-2">
					<Trackable trackingKey={trackingKeys.click.model}>
						<ModelSelector
							className="w-full bg-transparent"
							trackingKeys={trackingKeys}
						/>
					</Trackable>
				</div>
			</div>
			{text && (
				<div className="text-base/relaxed break-words">
					<Markdown>{text}</Markdown>
				</div>
			)}
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
	return (
		<Header2 className="break-words markdown line-clamp-4">
			<Markdown>{trimForQuotes(title)}</Markdown>
		</Header2>
	);
}

function Spinner() {
	return (
		<div className="flex items-center justify-center mx-auto size-24">
			<Icons.loader />
		</div>
	);
}
