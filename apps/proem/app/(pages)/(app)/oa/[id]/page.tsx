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
import { ReactNode, Suspense } from "react";
import { ReaderPaper } from "./components/reader-paper";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";
import { PageLayout } from "../../page-layout";
import { Search } from "lucide-react";
import { generateStarters } from "@/app/prompts/starters";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";

type Props = {
	params: { id: string };
	searchParams: { title?: string };
};

export default async function ReaderPage({ params }: Props) {
	const paper = await fetchPaper(params.id);

	if (!paper) {
		notFound();
	}

	const starters = paper?.generated?.starters
		? paper?.generated?.starters
		: await generate(paper);

	const [starterMsgs, messages, input] = [null, null, null];
	// const [starterMsgs, messages, input] = PaperChat2({ paper, starters }) as [
	// 	ReactNode,
	// 	ReactNode,
	// 	ReactNode,
	// ];

	return (
		<PageLayout title="read">
			<div className="mx-[-16px]">
				<ReaderPaper id={params.id} paper={paper}>
					<Suspense fallback={<Spinner />}>
						<Summary paper={paper} />
					</Suspense>
				</ReaderPaper>

				<Tabs defaultValue="QA" className="w-full">
					<TabsList className="text-[14px] sticky z-10 justify-start w-full bg-background top-10 h-[unset] pt-3 pb-3 px-4">
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
						<div className="flex flex-col h-full gap-6 px-4">
							<Suspense fallback={<Spinner />}>{messages}</Suspense>
						</div>
					</TabsContent>
					<TabsContent value="metadata">
						<div className="flex flex-col px-4 mb-2">
							<Metadata paper={paper} />
						</div>
					</TabsContent>
				</Tabs>
			</div>
			<div>
				<div className="flex items-center font-sourceCodePro">
					<Search
						style={{ height: "12px", strokeWidth: "3" }}
						className="w-4"
					/>
					SUGGESTED QUESTIONS
				</div>
				<div>{starterMsgs}</div>
				<div>{input}</div>
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
