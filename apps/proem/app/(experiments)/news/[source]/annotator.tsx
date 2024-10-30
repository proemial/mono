"use client";
import { Throbber } from "@/components/throbber";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { z } from "zod";
import { annotateWithScienceAction } from "./actions";
import { InputForm } from "./form";
import { PrimaryItemSchema } from "./types";
import { Scaffold } from "./components/scaffold";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export default function NewsAnnotator({ url }: { url?: string }) {
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

	console.log("factsAndQuestions", factsAndQuestions);

	return (
		<div className="flex flex-col gap-6">
			{!url && !factsAndQuestions?.output && (
				<InputForm onSubmit={handleSubmit} />
			)}
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
			{factsAndQuestions?.output && (
				<Scaffold data={factsAndQuestions.output} />
			)}
		</div>
	);
}
