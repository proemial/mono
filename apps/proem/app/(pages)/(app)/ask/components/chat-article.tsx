import { AIGeneratedIcon } from "@/components/icons/AIGeneratedIcon";
import Markdown from "@/components/markdown";
import { Trackable } from "@/components/trackable";
import { Header4 } from "@proemial/shadcn-ui";
import { ModelSelector, ModelSelectorProps } from "./model-selector";

type ChatArticleProps = {
	type: "Answer";
	trackingKeys: ModelSelectorProps["trackingKeys"];
	text?: string;
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
			<div className="text-base/relaxed break-words">
				<Markdown>{text as string}</Markdown>
			</div>
		</div>
	);
}
