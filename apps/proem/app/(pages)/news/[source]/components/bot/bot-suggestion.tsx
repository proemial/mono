import { Trackable } from "@/components/trackable";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { ArrowRight } from "lucide-react";
import { cn } from "@proemial/shadcn-ui";

export function BotSuggestion({
	qa,
	isLoading,
	isAsked,
	handleSuggestionClick,
}: {
	qa: [string, string];
	isLoading: boolean;
	isAsked: boolean;
	handleSuggestionClick: (question: string) => void;
}) {
	const [question] = qa;

	return (
		<Trackable
			trackingKey={
				analyticsKeys.experiments.news.item.qa.clickSuggestedQuestion
			}
			properties={{ question }}
		>
			<button
				disabled={isLoading || isAsked}
				type="button"
				onClick={() => handleSuggestionClick(question)}
				className={cn(
					"bg-[#e9eaee] rounded-xl gap-2 py-2 px-3 flex justify-between items-center text-left text-[15px] w-full",
					{
						"hover:bg-[#e9eaee] hover:border-[#e9eaee]   cursor-pointer":
							!isLoading && !isAsked,
						"text-gray-400 border-gray-200 cursor-not-allowed":
							isLoading || isAsked,
					},
				)}
			>
				<div>{question}</div>
				<div>
					<ArrowRight className="size-5 opacity-50" />
				</div>
			</button>
		</Trackable>
	);
}
