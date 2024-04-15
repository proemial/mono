import { analyticsKeys } from "@/app/components/analytics/analytics-keys";
import { LinkButton } from "@/app/components/proem-ui/link-button";
import { STARTERS } from "@/app/old/(pages)/(app)/(answer-engine)/starters";
import { fetchLatestPapers } from "@/app/old/(pages)/(app)/oa/[id]/fetch-paper";
import { AskInput } from "@/app/old/(pages)/(app)/oa/ask-input";
import { Redirect } from "@/app/old/(pages)/(app)/oa/redirect";
import { Search } from "lucide-react";
import { PageLayout } from "../page-layout";

export const revalidate = 1;

export default async function ReadPage() {
	return (
		<Redirect>
			<PageLayout title="read">
				{/* justify-content: space-between;
    height: 100%; */}
				<div className="relative flex flex-col justify-between w-full h-full px-4 pt-6">
					<div className="flex flex-col items-center justify-center text-center">
						<Text />
					</div>
					<div className="flex flex-col gap-2 py-2 pb-16 text-xs font-normal">
						<Actions />
					</div>
				</div>
				<div className="flex flex-col px-2 pt-1 pb-2">
					<Questions />
					<AskInput />
				</div>
			</PageLayout>
		</Redirect>
	);
}

function Text() {
	return (
		<>
			<div className="pb-4 text-xl">No Paper Selected</div>
			<div className="text-md text-white/80">
				<div>To find an interesting paper, start by</div>
				<div>asking a question, or go to the feed</div>
				<div>and click a summary of a recent paper</div>
				<div>from a domain you are interested in.</div>
				<div>You can also just click one of the</div>
				<div>suggestions below.</div>
			</div>
		</>
	);
}

async function Actions() {
	const latestPapers = await fetchLatestPapers();
	const randomId =
		latestPapers[Math.floor(Math.random() * latestPapers.length)]?.id ?? "";

	return (
		<div className="flex flex-col">
			<div className="flex items-center font-sourceCodePro">
				<Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
				SUGGESTED ACTIONS
			</div>
			<LinkButton
				href="/feed"
				className="mb-2"
				track={analyticsKeys.read.click.feed}
			>
				Open your feed
			</LinkButton>
			<LinkButton
				href={`/oa/${randomId}`}
				className="mb-2"
				track={analyticsKeys.read.click.random}
			>
				Open a random recent paper
			</LinkButton>
		</div>
	);
}

function Questions() {
	const starters = [...STARTERS]
		.map((text, index) => ({ index, text }))
		.sort(() => 0.5 - Math.random())
		.slice(0, 3);

	return (
		<div>
			<div className="flex items-center font-sourceCodePro">
				<Search style={{ height: "12px", strokeWidth: "3" }} className="w-4" />
				SUGGESTED QUESTIONS
			</div>
			{starters.map((starter) => (
				<LinkButton
					key={starter.index}
					href={`/?q=${encodeURIComponent(starter.text)}`}
					variant="starter"
					className="my-2"
					track={analyticsKeys.read.click.askStarter}
				>
					{starter.text}
				</LinkButton>
			))}
		</div>
	);
}
