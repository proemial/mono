import { SelectContentSelector } from "@/components/select-content-selector";

type Props = {
	className?: string;
	trackingKey: string;
};

export const ModelSelector = ({ className, trackingKey }: Props) => (
	<SelectContentSelector
		className={className}
		selector={[
			{ value: "trending", label: "GPT-4 Turbo" },
			{ value: "popular", label: "Claude 3 Opus", disabled: true },
			{ value: "curious", label: "Gemini 1.5 Pro", disabled: true },
			{ value: "curious", label: "Mistral Large	", disabled: true },
			{ value: "curious", label: "Mixtral 8x22B", disabled: true },
			{ value: "curious", label: "Llama 3", disabled: true },
		]}
		trackingKey={trackingKey}
	/>
);
