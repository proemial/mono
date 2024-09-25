import { AddToCollectionButtonProps } from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { SpacePapers } from "@/app/embed/[space]/space-papers";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { MicroAbstract } from "@/components/chat-abstract";
import { AIGeneratedIcon } from "@/components/icons/AIGeneratedIcon";
import Markdown from "@/components/markdown";
import { ModelSelector, ModelSelectorProps } from "@/components/model-selector";
import { PaperList } from "@/components/paper-list";
import { PaperMetaData } from "@/components/paper-meta-data";
import { Trackable } from "@/components/trackable";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { trimForQuotes } from "@/utils/string-utils";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { Button, Header2, Header4, Icons } from "@proemial/shadcn-ui";
import {
	BookOpen01,
	ChevronRight,
	Heading01,
	LinkExternal02,
	Users01,
} from "@untitled-ui/icons-react";
import { Suspense } from "react";
import { EngagementIndicator } from "./engagement-indicator";
import { GotoSpaceButton, SpaceName } from "./space-name-button";

type ChatArticleProps = Pick<
	AddToCollectionButtonProps,
	"isBookmarked" | "customCollectionId"
> & {
	type: "Answer" | "Paper Summary";
	trackingKeys: ModelSelectorProps["trackingKeys"];
	text?: string;
	paper?: OpenAlexPaper;
	paperPosts: PostWithCommentsAndAuthor[];
	readers: BasicReaderUserData[];
};

export function ChatArticle({
	type,
	trackingKeys,
	text,
	paper,
	isBookmarked,
	customCollectionId,
	paperPosts,
	readers,
}: ChatArticleProps) {
	const title = paper?.generated?.title;
	const authors = paper?.data.authorships;
	const publisher = paper?.data.primary_location.source?.display_name;

	return (
		<div className="space-y-3 text-pretty">
			{title ? (
				<div>
					{type === "Paper Summary" ? (
						<PaperMetaData
							topics={paper.data.topics}
							// Fall back to publication_date for backwards compatibility
							date={
								paper.data.created_date ||
								(paper.data.publication_date as string)
							}
							readonly={false}
							isBookmarked={isBookmarked}
							id={paper.id}
							customCollectionId={customCollectionId}
						/>
					) : null}
					<Header2 className="break-words markdown line-clamp-4 m-0">
						<Markdown>{trimForQuotes(title)}</Markdown>
					</Header2>
				</div>
			) : null}

			<EngagementIndicator
				posts={paperPosts}
				readers={readers}
				className="py-1"
			/>

			{authors ? (
				<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
					<a
						href={paper.data.primary_location?.landing_page_url}
						target="_blank"
						rel="noreferrer"
						className="text-gray-600 flex items-center justify-between gap-1 text-xs hover:text-gray-700 transition-opacity"
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
									<Heading01 className="size-2.5" />
								</div>
								<div className="truncate pr-6">{paper.data.title}</div>
							</div>

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
			{paper && (
				<>
					<Trackable trackingKey={analyticsKeys.read.click.fullPaper}>
						<div className="flex items-center justify-center w-full my-8">
							<a
								href={paper.data.primary_location?.landing_page_url}
								target="_blank"
								rel="noreferrer"
							>
								<Button className="gap-2">
									<span>View full article</span>{" "}
									<LinkExternal02 className="size-4" />
								</Button>
							</a>
						</div>
					</Trackable>
				</>
			)}

			{paper && customCollectionId && (
				<>
					<Header4>
						<SpaceName collectionId={customCollectionId}>
							More papers from
						</SpaceName>
					</Header4>
					<Suspense fallback={<Spinner />}>
						<SpacePapers
							space={customCollectionId}
							count={3}
							background="lightgrey"
							filter={(p) => p.id !== paper.id}
						/>
					</Suspense>
					<div className="text-center pt-4">
						<GotoSpaceButton collectionId={customCollectionId} />
					</div>
				</>
			)}

			{paper && !customCollectionId && (
				<>
					<Header4>Related papers</Header4>
					<PaperList ids={paper.data.related_works} limit={3} />
				</>
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
