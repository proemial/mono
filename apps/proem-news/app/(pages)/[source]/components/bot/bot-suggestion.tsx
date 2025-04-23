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
					"bg-[#e9eaee] rounded-xl border border-[#d9dade] gap-2 py-2 px-3 flex justify-between items-center text-left text-[15px] w-full",
					{
						"hover:bg-[#d9dade] hover:border-[#c9cace] cursor-pointer":
							!isLoading && !isAsked,
						"text-gray-400 border-gray-200 cursor-not-allowed":
							isLoading || isAsked,
					},
				)}
			>
				<div>{question}</div>
				<div>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10.5 8.19202H2.7659C2.6529 7.93402 0.388897 2.81402 0.388897 2.81402C-0.371106 1.09402 1.4469 -0.627979 3.1229 0.22302L16.9039 7.21702C18.3639 7.95702 18.3639 10.043 16.9039 10.783L3.1239 17.777C1.4469 18.628 -0.371106 16.905 0.388897 15.186L2.7639 9.808H10.5" fill="#666"/>
					</svg>
				</div>
			</button>
		</Trackable>
	);
}
