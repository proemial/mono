import { findPapersForSpaceChain } from "@/app/llm/chains/question-from-space-chain";
import { FeatureBadge, FeatureCloud } from "@/components/feature-badges";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import {
	fetchFingerprints,
	fetchPapersTitles,
} from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Button, Input, Textarea } from "@proemial/shadcn-ui";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Feed } from "../../space/(discover)/feed";

const defaultPrompt =
	"You are tasked with rephrasing a title and description as a question, so that it becomes unambiguous and makes sense standing on its own. Use the chat history to understand the context of the question. Your rephrased question should be clear and concise. If you find it necessary, you may expand the question so it includes enough information to make it unambiguous.";

export const metadata: Metadata = {
	title: "Create space from description",
};

type Props = {
	searchParams?: {
		ids?: string;
		question?: string;
		title?: string;
		description?: string;
	};
};

export default async function FingerprintsPage({ searchParams }: Props) {
	async function findPapers(formData: FormData) {
		"use server";

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const prompt = formData.get("prompt") as string;

		const result = await findPapersForSpaceChain.invoke({
			title,
			description,
			prompt,
		});
		const parsed = { ...result, papers: JSON.parse(result.papers) };

		const baseUrl = `/experimental/space-from-description?question=${result.question}&title=${title}&description=${description}`;

		if (result.papers.length) {
			return redirect(
				`${baseUrl}&ids=${parsed.papers.map((p: { link: string }) => p.link.substring(p.link.lastIndexOf("/") + 1)).join(",")}`,
			);
		} else {
			return redirect(baseUrl);
		}
		// redirect(`/experimental/space-from-description?ids=W2734703405,W2056126323,W2955170836,W3180244043,W3187279663`)
	}

	const { ids, question, title, description } = searchParams ?? {};
	const idsList = ids?.split(",").filter((id) => id.length > 0);

	const hasPapers = !!idsList?.length;

	const fingerprints = hasPapers ? await fetchFingerprints(idsList) : [];
	const { allFeatures, filter } = getFeatureFilter(fingerprints);
	const papers = hasPapers ? (await fetchPapersTitles(idsList)).flat() : [];

	return (
		<div className="pt-8 space-y-6">
			<form action={findPapers}>
				<div className="flex flex-col gap-1">
					<Input
						name="title"
						placeholder="Title"
						className="grow bg-white"
						defaultValue={title}
						required
					/>
					<Textarea
						name="description"
						placeholder="Description"
						className="grow bg-white"
						defaultValue={description}
						rows={2}
						required
					/>
					<Textarea
						name="prompt"
						placeholder="Prompt"
						className="grow bg-white"
						defaultValue={defaultPrompt}
						rows={5}
						required
					/>
					<Button type="submit" className="text-xs tracking-wider">
						Validate space input
					</Button>
				</div>
			</form>

			{question && (
				<div className="italics">
					<b>Generated paper search string:</b> {question}
				</div>
			)}

			{!hasPapers && (title || description) && <h2>No papers found</h2>}

			{hasPapers && (
				<Feed filter={{ features: filter }} nocache>
					<div>
						<h2>Space would be created based on theses papers and features:</h2>
						{papers.map((p) => (
							<FeatureBadge key={p.id}>{p.title}</FeatureBadge>
						))}
					</div>
					<FeatureCloud features={allFeatures} limit={20} />

					<h2>Example feed:</h2>
				</Feed>
			)}
		</div>
	);
}
