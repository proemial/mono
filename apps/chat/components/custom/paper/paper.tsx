import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { useObject } from "@/lib/use-object";
import { FeedItemField } from "./feed-item-field";
import { formatDate } from "@proemial/utils/date";
import {
	Button,
	Header1,
	Header2,
	Header4,
	Header3,
} from "@proemial/shadcn-ui";
import {
	BookOpen01,
	ChevronRight,
	Heading01,
	LinkExternal02,
	Users01,
	Stars02,
	File06,
} from "@untitled-ui/icons-react";

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
		<div className="">
			{isLoading ? (
				<div className="flex flex-col gap-4 animate-pulse">
					<div className="h-32 bg-muted-foreground rounded-lg" />
					<div className="h-6 w-3/4 bg-muted-foreground rounded" />
					<div className="h-4 w-1/2 bg-muted-foreground rounded" />
					<div className="h-4 w-1/3 bg-muted-foreground rounded" />
				</div>
			) : (
				<div className="flex flex-col gap-2 items-start p-4 rounded-lg bg-blue-500/10">
					<div className="text-muted-foreground">
						<Stars02 className="inline-block mr-2 size-4 top-[-1px] relative" />
						summary
					</div>
					<div className="text-lg font-semibold">{paper?.generated?.title}</div>
					<div className="text">{paper?.generated?.description}</div>
				</div>
			)}

			<div className="font-semibold text-3xl mt-6 mb-2">
				{paper?.data?.title}
			</div>
			<div className="text-muted-foreground text-sm mb-1">
				Published {formatDate(paper?.data?.publication_date, "relative")}
				{publisher && (
					<>
						in{" "}
						<a
							href={paper?.data?.primary_location?.landing_page_url}
							target="_blank"
							rel="noreferrer"
							className="font-semi-bold hover:underline hover:text-foreground no-underline text-foreground/65 transition"
						>
							{publisher}
						</a>
					</>
				)}
			</div>
			<div className="text-sm text-muted-foreground mb-1">
				Written by{" "}
				{paper?.data?.authorships
					?.map((author) => author.author.display_name)
					.join(", ")}
			</div>

			<div className="text-lg mt-4">
				{paper?.data?.abstract || "Abstract not found"}
			</div>

			{paper && (
				<div className="flex items-center justify-center w-full my-8">
					<a
						href={paper?.data?.primary_location?.landing_page_url}
						target="_blank"
						rel="noreferrer"
					>
						<Button
							variant="ghost"
							className="gap-2 hover:bg-muted-foreground/20"
						>
							<span>View full article</span>{" "}
							<LinkExternal02 className="size-4" />
						</Button>
					</a>
				</div>
			)}
		</div>
	);
}
