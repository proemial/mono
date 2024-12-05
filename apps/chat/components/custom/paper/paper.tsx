import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { useObject } from "@/lib/use-object";
import { FeedItemField } from "./feed-item-field";
import { formatDate } from "@proemial/utils/date";
import { Button, Header2, Header4 } from "@proemial/shadcn-ui";
import {
	BookOpen01,
	ChevronRight,
	Heading01,
	LinkExternal02,
	Users01,
} from "@untitled-ui/icons-react";
import { AIGeneratedIcon } from "./AIGeneratedIcon";

type StreamedPaper = {
	data: OpenAlexPaperWithAbstract;
	generated?: {
		title?: string;
		description?: string;
	};
};

export function ResearchPaper({ id }: { id: string }) {
	const { data: paper, isLoading } = useObject<StreamedPaper>(
		`/api/paper/${id}`,
	);
	const publisher = paper?.data?.primary_location?.source?.display_name;

	return (
		<div className="space-y-3 text-pretty">
			<div>
				<div className="flex items-center justify-between gap-2 mb-1">
					<FeedItemField topics={paper?.data?.topics} />
					<div className="flex items-center gap-2 ">
						<div className="uppercase text-2xs text-nowrap">
							<Skeletal isLoading={isLoading}>
								{formatDate(paper?.data?.publication_date, "relative")}
							</Skeletal>
						</div>
					</div>
				</div>
				<Header2 className="break-words markdown line-clamp-4 m-0">
					<Skeletal isLoading={isLoading}>{paper?.generated?.title}</Skeletal>
				</Header2>
			</div>

			<a
				href={paper?.data?.primary_location?.landing_page_url}
				target="_blank"
				rel="noreferrer"
				className="text-gray-600 flex items-center justify-between gap-1 text-xs hover:text-gray-700 transition-opacity"
			>
				<div className="flex-grow w-1/2">
					<Skeletal isLoading={isLoading}>
						<div className="flex items-center gap-2.5">
							<div>
								<BookOpen01 className="size-2.5" />
							</div>
							<div className="truncate">{publisher}</div>
						</div>
					</Skeletal>

					<div className="flex items-center gap-2.5">
						<div>
							<Heading01 className="size-2.5" />
						</div>
						<div className="truncate pr-6">
							<Skeletal isLoading={isLoading}>{paper?.data?.title}</Skeletal>
						</div>
					</div>

					<div className="flex items-center gap-2.5">
						<div>
							<Users01 className="size-2.5" />
						</div>
						<span className="truncate flex-grow">
							<Skeletal isLoading={isLoading}>
								{paper?.data?.authorships
									?.map((author) => author.author.display_name)
									.join(", ")}
							</Skeletal>
						</span>
					</div>
				</div>

				<ChevronRight className="size-5 opacity-50" />
			</a>

			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-2.5 gap">
					<AIGeneratedIcon />
					<Header4>Paper Summary</Header4>
				</div>
				<div className="flex justify-end flex-grow -mr-2">
					{/* <ModelSelector
                        className="w-full bg-transparent"
                        trackingKeys={trackingKeys}
                    /> */}
				</div>
			</div>
			<div className="text-base/relaxed break-words">
				<Skeletal isLoading={isLoading}>
					{paper?.generated?.description}
				</Skeletal>
			</div>
			{paper && (
				<div className="flex items-center justify-center w-full my-8">
					<a
						href={paper?.data?.primary_location?.landing_page_url}
						target="_blank"
						rel="noreferrer"
					>
						<Button className="gap-2">
							<span>View full article</span>{" "}
							<LinkExternal02 className="size-4" />
						</Button>
					</a>
				</div>
			)}
		</div>
	);
}

function Skeletal({
	isLoading,
	children,
}: { isLoading: boolean; children?: React.ReactNode | string }) {
	if (isLoading) {
		return <div className="w-full bg-slate-400 animate-pulse">&nbsp;</div>;
	}

	return children;
}
