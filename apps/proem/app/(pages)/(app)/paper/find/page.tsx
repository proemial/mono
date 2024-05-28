import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { Button, Input } from "@proemial/shadcn-ui";
import { notFound } from "next/navigation";
import PaperForm from "./form";
import { getPaperId } from "@/utils/oa-paper";
import { redirect } from "next/navigation";

const description = "Read science fast";

export default async function ReaderInputPage() {
	async function findPaper(formData: FormData) {
		"use server";

		const identifier = formData.get("identifier");
		const paperId = await getPaperId(identifier as string);

		console.log(paperId);

		if (!paperId) {
			notFound();
		}

		redirect(`/paper/oa/${paperId}`);
	}

	return (
		<form action={findPaper}>
			<div className="flex flex-col gap-2 items-end">
				<Input
					name="identifier"
					placeholder="Identifier"
					className="grow bg-white dark:bg-neutral-600"
				/>
				<Button type="submit" className="text-xs tracking-wider">
					Find paper
				</Button>
			</div>
			<div className="mt-2">
				Examples:
				<ul className="list-disc mx-8 my-4">
					<li>https://arxiv.org/abs/1706.03762</li>
					<li>https://arxiv.org/abs/1706.03762v7</li>
					<li>1706.03762</li>
					<li>1706.03762v7</li>
					<li>https://doi.org/10.48550/arxiv.2306.04526</li>
					<li>10.48550/arxiv.2306.04526</li>
					<li>https://pubmed.ncbi.nlm.nih.gov/37796173</li>
					<li>W4385245566</li>
				</ul>
			</div>
		</form>
	);
}
