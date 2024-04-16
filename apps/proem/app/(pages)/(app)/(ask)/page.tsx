import { ChatForm } from "@/components/chat-form";
import { SelectContentSelector } from "@/components/select-content-selector";
import { Suggestions } from "@/components/suggestions";

export default function AskPage() {
	// TODO: Fetch top nice starters from DB
	const starters = [
		"Does organic farming produce more greenhouse gasses?",
		"How can I lower my blood pressure?",
		"Have low-fat diets increased obesity?",
	];

	return (
		<div className="space-y-2">
			<Suggestions suggestions={starters} />
			<div className="space-y-1">
				<SelectContentSelector
					selector={[
						{ value: "popular", label: "Popular" },
						{ value: "trending", label: "Trending", disabled: true },
						{ value: "curious", label: "Curious", disabled: true },
					]}
				/>
				<ChatForm placeholder="Ask a question" />
			</div>
		</div>
	);
}
