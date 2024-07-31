import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { MicroAbstract } from "@/components/chat-abstract";
import { AIGeneratedIcon } from "@/components/icons/AIGeneratedIcon";
import { ModelSelector, ModelSelectorProps } from "@/components/model-selector";
import { Trackable } from "@/components/trackable";
import { trimForQuotes } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Header2, Header4, Icons } from "@proemial/shadcn-ui";
import { BookOpen01, ChevronRight, Users01 } from "@untitled-ui/icons-react";
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
	const publisher = paper?.data.primary_location.source?.display_name;

	return (
		<div className="space-y-3 text-pretty">
			{title ? <Title title={title} /> : null}

			{authors ? (
				<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
					<a
						href={paper.data.primary_location?.landing_page_url}
						target="_blank"
						rel="noreferrer"
						className="opacity-50 flex items-center justify-between gap-1 uppercase text-[10px] hover:opacity-75 transition-opacity"
					>
						<div className="flex-grow w-1/2">
							{publisher && (
								<div className="flex items-center gap-2.5">
									<div>
										<BookOpen01 className="size-2.5" />
									</div>
									<div className="truncate">{publisher}</div>
								</div>
							)}

							<div className="flex items-center gap-2.5">
								<div>
									<Users01 className="size-2.5" />
								</div>
								<span className="truncate flex-grow">
									{authors
										.map((author) => author.author.display_name)
										.join(", ")}
								</span>
							</div>
						</div>

						<ChevronRight className="size-5 opacity-50" />
					</a>
				</Trackable>
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

/* <CollapsibleSection
					trackingKey={analyticsKeys.read.click.collapse}
					trigger={
						<PaperReaderHeadline
							paperId={fetchedPaper.id}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
						/>
					}
					collapsed
				>
					<HorisontalScrollArea>
						<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
							<a
								href={fetchedPaper.data.primary_location?.landing_page_url}
								target="_blank"
								rel="noreferrer"
							>
								<PaperCardDiscover
									title={fetchedPaper.data.title}
									date={fetchedPaper.data.publication_date}
									publisher={
										fetchedPaper.data.primary_location.source?.display_name
									}
								/>
							</a>
						</Trackable>

						{fetchedPaper.data.authorships.map((author) => (
							<PaperCardDiscoverProfile
								key={author.author.id}
								name={author.author.display_name}
							/>
						))}
					</HorisontalScrollArea>
				</CollapsibleSection> */
