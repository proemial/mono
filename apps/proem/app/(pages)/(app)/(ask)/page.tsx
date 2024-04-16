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
		<div className="flex flex-col flex-grow gap-4 justify-end">
			<div className="flex flex-col gap-2">
				<div className="flex justify-end">
					<SelectContentSelector
						selector={[
							{ value: "popular", label: "Popular" },
							{ value: "trending", label: "Trending", disabled: true },
							{ value: "curious", label: "Curious", disabled: true },
						]}
					/>
				</div>
				<Suggestions suggestions={starters} />
			</div>
			<ChatForm placeholder="Ask a question" />
		</div>
	);
}
