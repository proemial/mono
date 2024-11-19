import { AIGeneratedIcon } from "@/components/icons/AIGeneratedIcon";
import { Trackable } from "@/components/trackable";
import { Header4 } from "@proemial/shadcn-ui";
import { ModelSelector, ModelSelectorProps } from "./model-selector";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";

type ChatArticleProps = {
	type: "Answer";
	trackingKeys: ModelSelectorProps["trackingKeys"];
	text: string | undefined;
};

export function ChatArticle({ type, trackingKeys, text }: ChatArticleProps) {
	return (
		<div className="space-y-3 text-pretty">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-2.5 gap">
					<AIGeneratedIcon />
					<Header4>{type}</Header4>
				</div>
				<div className="flex justify-end flex-grow -mr-2">
					<Trackable trackingKey={trackingKeys.click.model}>
						<ModelSelector
							className="w-full bg-transparent"
							trackingKeys={trackingKeys}
						/>
					</Trackable>
				</div>
			</div>
			<div className="text-base/relaxed break-words flex flex-col gap-2">
				<div>{formatAnswerTextNoLinks(text)}</div>
			</div>
		</div>
	);
}

const formatAnswerTextNoLinks = (text?: string) => {
	if (!text) return "";
	return text
		.replace(/^\s*-\s*/gm, "")
		.split(/(\[.*?\])/)
		.map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				const numbers = match[1]?.split(",").map((n) => n.trim());
				return numbers?.map((num, j) => (
					<Trackable
						key={`${i}-${j}`}
						trackingKey={analyticsKeys.ask.click.inlineReference}
					>
						<span className="relative inline-block">
							<div className="relative -top-[2px] inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold cursor-default hover:bg-gray-800">
								{num}
							</div>
						</span>
					</Trackable>
				));
			}
			return segment;
		});
};
