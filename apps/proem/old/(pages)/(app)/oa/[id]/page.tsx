import { analyticsKeys } from "@/app/components/analytics/tracking/tracking-keys";
import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessages } from "@/app/components/chat/chat-messages";
import { StarterMessages } from "@/app/components/chat/chat-starters";
import { Spinner } from "@/app/components/loading/spinner";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/components/shadcn-ui/tab";
import { Trackable } from "@/app/components/trackable";
import { generateStarters } from "@/app/prompts/starters";
import { Metadata } from "@/old/(pages)/(app)/oa/[id]/components/panels/metadata";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLayout } from "../../page-layout";
import { ReaderPaper } from "./components/reader-paper";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";

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
					<TabsList className="text-[14px] sticky justify-start w-full bg-background top-0 h-[unset] pt-3 pb-3 px-4 z-50">
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
						<ChatMessages
							starters={starters}
							title={title}
							abstract={abstract as string}
						>
							<StarterMessages
								target="paper"
								trackingKey={analyticsKeys.read.click.starter}
							/>
						</ChatMessages>
					</TabsContent>
					<TabsContent value="metadata">
						<div className="flex flex-col px-4 mb-2">
							<Metadata paper={paper} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
			<div className="flex flex-col px-2 pt-1 pb-2">
				<ChatInput target="paper" />
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
