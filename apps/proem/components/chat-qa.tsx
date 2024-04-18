"use client";

import { QAEntry } from "@/components/qa-message";
import { Header4 } from "@proemial/shadcn-ui";
import { GanttChart } from "./icons/GanttChart";
import { SelectContentSelector } from "./select-content-selector";

export function ChatQA() {
	const messages = [
		// {
		// 	type: "question",
		// 	text: "What is the purpose of the Statistical Interpretation of quantum theory?",
		// 	replies: 3,
		// 	likes: 2,
		// 	author: {
		// 		name: "You",
		// 		avatar: "https://github.com/shadcn.png",
		// 	},
		// },
		{
			type: "question",
			text: "How does the Statistical Interpretation propose to view the quantum state description?",
			replies: 2,
			likes: 1,
			author: {
				name: "You",
			},
		},
		{
			type: "answer",
			text: "The purpose is to explain quantum phenomena statistically. A method for calculating functions in crystals is proposed. Statistical Interpretation of Quantum Mechanics Calculating Functions.",
			likes: 1,
			author: {
				name: "PROEM",
				avatar: "https://github.com/shadcn.png",
			},
		},
		{
			type: "question",
			text: "What is the implication of Bell’s theorem on hidden-variable theories that reproduce quantum mechanics excactly?",
			replies: 12,
			likes: 6,
			author: {
				name: "You",
			},
		},
		{
			type: "answer",
			text: "@kevinleong Great question!",
			likes: 1,
			author: {
				name: "PROEM",
				avatar: "https://github.com/shadcn.png",
			},
		},
	];

	function onClick() {
		console.log("Ask follow-up...");
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<GanttChart />
					<Header4>Q&A</Header4>
				</div>
				{/* <SelectContentSelector
					selector={[
						{ value: "latest", label: "Latest" },
						{ value: "popular", label: "Popular" },
						{ value: "trending", label: "Trending" },
						{ value: "unanswered", label: "Unanswered" },
					]}
				/> */}
			</div>
			<div className="flex flex-col gap-6 place-items-end">
				{messages.map((message, index) => (
					<QAEntry key={index} message={message} />
				))}
			</div>
		</div>
	);
}
