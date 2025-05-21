import { Markdown } from "./markdown";
import { QdrantPaper } from "../actions/search-action";
import { useRef } from "react";
import { useChat } from "ai/react";
import { Throbber } from "./throbber";

export function PaperBot({ paper }: { paper: QdrantPaper }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const systemPrompt = `
    You are Proem AI, specializing in helping users understand scientific papers. You have access to a vast database of scientific literature and can provide information and answers based on this knowledge.
    <paper>
        <title>${paper.title}</title>
        <abstract>${paper.abstract}</abstract>
    </paper>

    Your capabilities include:
    - Answering questions about the paper's title and content.
    - Answering questions about general topics.

    When responding to a user's question:
    - Always keep your answer concise and to the point.
    - Keep your answers short and preferably in a single sentence.
    `;

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		append,
		isLoading,
		error,
	} = useChat({
		api: "/api/chat",
		initialMessages: [
			{
				id: "system",
				role: "system",
				content: systemPrompt,
			},
		],
	});

	return (
		<div className="mt-8 rounded-lg p-4 shadow-inner">
			<div className="flex flex-col gap-4 mb-4">
				{messages
					.filter((m) => m.role === "assistant" || m.role === "user")
					.map((m, i) => (
						<div
							key={m.id || i}
							className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[75%] px-4 py-2 shadow-md relative rounded-2xl ${
									m.role === "user"
										? "bg-green-900 text-green-100 rounded-br-sm self-end"
										: "bg-[#232a36] text-white rounded-bl-sm self-start"
								}`}
							>
								<Markdown>{m.content}</Markdown>
								<div
									className={`absolute top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ${
										m.role === "user"
											? "right-[-10px] border-l-8 border-l-green-900"
											: "left-[-10px] border-r-8 border-r-[#232a36]"
									}`}
								/>
							</div>
						</div>
					))}
				{isLoading && (
					<Throbber className="w-full" throbberStyle="w-6 h-6 text-green-300" />
				)}
				{error && (
					<div className="text-red-500">
						Sorry, there was an error getting the answer.
					</div>
				)}
			</div>
			<form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					type="text"
					placeholder="Ask a question about this paper..."
					className="flex-1 p-2 rounded-lg bg-[#181c1f] border border-[#232a36] text-white focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
					value={input}
					onChange={handleInputChange}
					disabled={isLoading}
				/>
				<button
					type="submit"
					className="px-4 py-2 bg-green-300 text-black rounded-lg font-semibold shadow hover:bg-green-200 transition-all duration-200 disabled:opacity-60"
					disabled={isLoading || !input.trim()}
				>
					Send
				</button>
			</form>
		</div>
	);
}
