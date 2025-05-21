import { QdrantPaper } from "../actions/search-action";
import ResearchPaper from "./paper";
import { X } from "@untitled-ui/icons-react";
import { Markdown } from "./markdown";
import { PaperBot } from "./paper-bot";
export function PaperDetail({
	paper,
	onClose,
}: { paper: { paper: QdrantPaper; summary: string }; onClose: () => void }) {
	console.log(paper);
	return (
		<div className="p-5 mb-6 rounded-xl shadow-lg bg-gradient-to-br from-[#181c1f] via-[#232a36] to-[#1a2220] relative text-white">
			<button
				type="button"
				className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-green-300 transition-colors p-2 rounded-full bg-[#181c1f] bg-opacity-95 border border-[#232a36] shadow-lg focus:outline-none z-20"
				onClick={onClose}
				aria-label="Close details"
			>
				<X className="w-6 h-6 text-white" />
			</button>
			<ResearchPaper paper={paper.paper} summary={paper.summary} />

			<PaperBot paper={paper.paper} />
		</div>
	);
}
