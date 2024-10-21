"use client";

import { z } from "zod";
import { anchorInScienceAction } from "./actions";
import { TextareaForm } from "./form";
import { FormSchema } from "./types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Link from "next/link";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const FactsAndQuestions = () => {
	const [factsAndQuestions, setFactsAndQuestions] = useState<
		Awaited<ReturnType<typeof anchorInScienceAction>> | undefined
	>();

	const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
		const result = await anchorInScienceAction(data);
		setFactsAndQuestions(result);
	};

	return (
		<div className="flex flex-col gap-6">
			<TextareaForm onSubmit={handleSubmit} />
			{factsAndQuestions && (
				<div className="flex flex-col gap-2">
					<div className="flex flex-col">
						<h3>Facts</h3>
						<div className="prose text-sm">
							<ReactMarkdown>{factsAndQuestions.facts}</ReactMarkdown>
						</div>
					</div>
					<div className="flex flex-col">
						<h3>Q&A</h3>
						<div className="prose text-sm">
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
									<div className="flex items-center gap-2 text-sm pl-2 hover:bg-theme-600 py-0.5 rounded-md">
										<div className="text-[#6c7381] min-w-6">{index + 1}.</div>
										<div className="flex flex-col gap-0.5">
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
