"use client";

import { useState, useTransition } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@proemial/shadcn-ui/components/ui/collapsible";
import { Textarea } from "@proemial/shadcn-ui/components/ui/textarea";
import { Button } from "@proemial/shadcn-ui/components/ui/button";
import { ChevronDown, ChevronUp } from "@untitled-ui/icons-react";
import { JSONHighlighter } from "./json-highlighter";
import { submitConfiguration } from "./run-prompt";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export default function CollapsibleForm({
	tools,
	messages,
	prompt,
	metadata,
}: {
	tools: string;
	messages: string;
	prompt: string;
	metadata: SlackEventMetadata;
}) {
	const [promptValue, setPromptValue] = useState(prompt);
	const [toolsValue, setToolsValue] = useState(tools);
	const [messagesValue, setMessagesValue] = useState(messages);
	const [answerValue, setAnswerValue] = useState("");

	const [promptOpen, setPromptOpen] = useState(false);
	const [toolsOpen, setToolsOpen] = useState(false);
	const [messagesOpen, setMessagesOpen] = useState(false);
	const [answerOpen, setAnswerOpen] = useState(false);

	// Add state for handling the submission loading state
	const [isPending, startTransition] = useTransition();

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="space-y-4">
				{/* Prompt Section */}
				<Collapsible
					open={promptOpen}
					onOpenChange={setPromptOpen}
					className="border rounded-md"
				>
					<CollapsibleTrigger asChild>
						<div className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-100">
							<h3 className="text-lg font-medium">Prompt</h3>
							<Button variant="ghost" size="sm">
								{promptOpen ? <ChevronUp /> : <ChevronDown />}
							</Button>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent className="p-4 pt-0 border-t">
						<Textarea
							placeholder="Enter prompt here..."
							className="min-h-[200px] w-full p-3 border rounded-md font-mono text-sm whitespace-pre-wrap break-words text-slate-900"
							value={promptValue}
							onChange={(e) => setPromptValue(e.target.value)}
						/>
					</CollapsibleContent>
				</Collapsible>

				{/* Tools Section */}
				<Collapsible
					open={toolsOpen}
					onOpenChange={setToolsOpen}
					className="border rounded-md"
				>
					<CollapsibleTrigger asChild>
						<div className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-100">
							<h3 className="text-lg font-medium">Tools</h3>
							<Button variant="ghost" size="sm">
								{toolsOpen ? <ChevronUp /> : <ChevronDown />}
							</Button>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent className="p-4 pt-0 border-t">
						<JSONHighlighter value={toolsValue} onChange={setToolsValue} />
					</CollapsibleContent>
				</Collapsible>

				{/* Messages Section */}
				<Collapsible
					open={messagesOpen}
					onOpenChange={setMessagesOpen}
					className="border rounded-md"
				>
					<CollapsibleTrigger asChild>
						<div className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-100">
							<h3 className="text-lg font-medium">Messages</h3>
							<Button variant="ghost" size="sm">
								{messagesOpen ? <ChevronUp /> : <ChevronDown />}
							</Button>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent className="p-4 pt-0 border-t">
						<JSONHighlighter
							value={messagesValue}
							onChange={setMessagesValue}
						/>
					</CollapsibleContent>
				</Collapsible>
			</div>

			<div className="mt-6">
				<Button
					className="w-full"
					disabled={isPending}
					onClick={() => {
						startTransition(async () => {
							// Call the server action
							const result = await submitConfiguration({
								prompt: promptValue,
								tools: toolsValue,
								messages: messagesValue,
								metadata,
							});
							setAnswerValue(JSON.stringify(result));
						});
					}}
				>
					{isPending ? "Processing..." : "Submit"}
				</Button>
			</div>

			{!!answerValue && (
				<div className="mt-6">
					<Collapsible
						open={answerOpen}
						onOpenChange={setAnswerOpen}
						className="border rounded-md"
					>
						<CollapsibleTrigger asChild>
							<div className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-slate-100">
								<h3 className="text-lg font-medium">Response</h3>
								<Button variant="ghost" size="sm">
									{messagesOpen ? <ChevronUp /> : <ChevronDown />}
								</Button>
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="p-4 pt-0 border-t">
							<JSONHighlighter value={answerValue} onChange={setAnswerValue} />
						</CollapsibleContent>
					</Collapsible>
				</div>
			)}
		</div>
	);
}
