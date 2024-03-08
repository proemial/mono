import { Metadata } from "@/app/(pages)/(app)/oa/[id]/components/panels/metadata";
import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import { Spinner } from "@/app/components/loading/spinner";
import { Trackable } from "@/app/components/trackable";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReaderPaper } from "./components/reader-paper";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";
import { PageLayout } from "../../page-layout";
import { Search } from "lucide-react";
import { generateStarters } from "@/app/prompts/starters";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { ChatInput } from "@/app/components/chat/chat-input";
import {
	ChatMessages,
	StarterMessages,
} from "@/app/components/chat/chat-messages";

type Props = {
	params: { id: string };
	searchParams: { title?: string };
};

export default async function ReaderPage({ params }: Props) {
	const paper = await fetchPaper(params.id);

	if (!paper) {
		notFound();
	}

	const { title, abstract } = paper.data;

	const starters = paper?.generated?.starters
		? paper?.generated?.starters
		: await generate(paper);

	return (
		<PageLayout title="read">
			<div className="mx-[-16px]">
				<ReaderPaper id={params.id} paper={paper}>
					<Suspense fallback={<Spinner />}>
						<Summary paper={paper} />
					</Suspense>
				</ReaderPaper>

				<Tabs defaultValue="QA" className="w-full">
					<TabsList className="text-[14px] sticky justify-start w-full bg-background top-10 h-[unset] pt-3 pb-3 px-4">
						<TabsTrigger value="QA">
							<Trackable track={analyticsKeys.read.click.answers}>
								Q & A
							</Trackable>
						</TabsTrigger>
						<TabsTrigger value="metadata">
							<Trackable track={analyticsKeys.read.click.metadata}>
								Metadata
							</Trackable>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="QA">
						<div className="px-4">
							<ChatMessages
								target="paper"
								title={title}
								abstract={abstract as string}
							/>
						</div>
					</TabsContent>
					<TabsContent value="metadata">
						<div className="flex flex-col px-4 mb-2">
							<Metadata paper={paper} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
			<div className="flex flex-col px-2 pt-1 pb-2">
				<StarterMessages
					starters={starters}
					target="paper"
					trackingKey={analyticsKeys.read.click.starter}
				/>
				<ChatInput
					target="paper"
					placeholders={[
						"Ask a question about this paper",
						"Ask a follow-up question",
					]}
					trackingKey={analyticsKeys.read.submit.question}
					authRequired
				/>
			</div>
		</PageLayout>
	);
}

async function generate(paper: OpenAlexPaper) {
	const paperTitle = paper?.data?.title;
	const abstract = paper?.data?.abstract;

	if (paperTitle && abstract) {
		const starters = await generateStarters(paperTitle, abstract);

		await Redis.papers.upsert(paper.id, (existingPaper) => {
			const generated = existingPaper.generated
				? { ...existingPaper.generated, starters }
				: { starters };

			return {
				...existingPaper,
				generated,
			};
		});

		return starters;
	}
	return [];
}
