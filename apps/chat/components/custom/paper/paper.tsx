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
			{/* <FeedItemField topics={paper?.data?.topics} /> */}
			<div className="text-muted-foreground">
				<Stars02 className="inline-block mr-2 size-4 top-[-2px] relative" />
				summary
			</div>
			<div className="text-xl font-semibold my-2">
				<Skeletal isLoading={isLoading}>{paper?.generated?.title}</Skeletal>
			</div>
			<div className="text-xl">
				<Skeletal isLoading={isLoading}>
					{paper?.generated?.description}
				</Skeletal>
			</div>

			{/* <hr className="border-t border-solid border-/20 my-8" /> */}

			<div className="text-muted-foreground italic mt-12">
				Published{" "}
				<Skeletal isLoading={isLoading}>
					{formatDate(paper?.data?.publication_date, "relative")}
				</Skeletal>{" "}
				in{" "}
				<Skeletal isLoading={isLoading}>
					<a
						href={paper?.data?.primary_location?.landing_page_url}
						target="_blank"
						rel="noreferrer"
						className="font-semi-bold hover:underline hover:text-foreground no-underline text-foreground/65 transition"
					>
						{publisher}
					</a>
				</Skeletal>
			</div>

			<div className="font-semibold text-lg my-2">
				<Skeletal isLoading={isLoading}>{paper?.data?.title}</Skeletal>
			</div>

			<div className="text-lg">
				<Skeletal isLoading={isLoading}>{paper?.data?.abstract}</Skeletal>
			</div>
			<div className="text-sm text-muted-foreground mt-4">
				Written by{" "}
				<Skeletal isLoading={isLoading}>
					{paper?.data?.authorships
						?.map((author) => author.author.display_name)
						.join(", ")}
				</Skeletal>
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

function Skeletal({
	isLoading,
	children,
}: { isLoading: boolean; children?: React.ReactNode | string }) {
	if (isLoading) {
		return <div className="w-full bg-slate-400 animate-pulse">&nbsp;</div>;
	}

	return children;
}
