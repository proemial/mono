"use client";

import { Throbber } from "@/components/throbber";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import { annotateWithScienceAction } from "./actions";
import { InputForm } from "./form";
import { PrimaryItemSchema } from "./types";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const FactsAndQuestions = ({ url }: { url?: string }) => {
	const [factsAndQuestions, setFactsAndQuestions] = useState<
		Awaited<ReturnType<typeof annotateWithScienceAction>> | undefined
	>();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (data: z.infer<typeof PrimaryItemSchema>) => {
		const result = await annotateWithScienceAction(data);
		setFactsAndQuestions(result);
	};

	useEffect(() => {
		if (url) {
			void (async () => {
				setIsLoading(true);
				const result = await annotateWithScienceAction({ url });
				setFactsAndQuestions(result);
				setIsLoading(false);
			})();
		}
	}, [url]);

	return (
		<div className="flex flex-col gap-6">
			{!url && <InputForm onSubmit={handleSubmit} />}
			{isLoading && (
				<div className="flex flex-col justify-center items-center gap-2">
					<Throbber />
					<div>
						Annotating <span className="font-bold underline">{url}</span> with
						science...
					</div>
				</div>
			)}
			{factsAndQuestions?.error && (
				<div className="flex flex-col justify-center items-center gap-2">
					<div className="text-red-500">{factsAndQuestions.error}</div>
				</div>
			)}
			{factsAndQuestions && !factsAndQuestions.error && (
				<div className="flex flex-col gap-2">
					{factsAndQuestions.artwork && (
						<img
							src={factsAndQuestions.artwork}
							alt="Artwork"
							width={714}
							height={400}
							className="rounded-lg object-cover drop-shadow-md max-w-[600px] self-center"
						/>
					)}
					<div className="flex flex-col">
						<h3>Facts</h3>
						<div className="prose text-base max-w-full">
							<ReactMarkdown>{factsAndQuestions.facts}</ReactMarkdown>
						</div>
					</div>
					<div className="flex flex-col">
						<h3>Q&A</h3>
						<div className="prose text-base max-w-full">
							<ReactMarkdown>{factsAndQuestions.questions}</ReactMarkdown>
						</div>
					</div>
					<div className="flex flex-col bg-theme-500 mt-4 p-4 pt-2 rounded-md">
						<h3>Sources</h3>
						<div className="flex flex-col gap-2">
							{factsAndQuestions.papers.map((paper, index) => (
								<Link
									key={paper.id}
									href={`/paper/oa/${paper.id.replace("https://openalex.org/", "")}`}
									target="_blank"
								>
									<div className="flex items-center gap-2 text-base pl-2 hover:bg-theme-600 py-0.5 rounded-md">
										<div className="text-[#6c7381] min-w-6">{index + 1}.</div>
										<div className="flex flex-col gap-1">
											<div>{toTitleCaseIfAllCaps(paper.title)}</div>
											<div className="flex gap-1 items-center text-xs text-[#6c7381]">
												<span>{dayjs(paper.created).format("ll")}</span>|
												<span>Score: {paper.score.toFixed(2)}</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
