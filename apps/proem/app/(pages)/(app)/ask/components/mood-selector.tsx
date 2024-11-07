import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { SelectContentSelector } from "@/components/select-content-selector";

type Props = {
	trackingPrefix: string;
	className?: string;
};

export const MoodSelector = ({ trackingPrefix, className }: Props) => (
	<SelectContentSelector
		className={className}
		selector={[
			{ value: "trending", label: "Trending" },
			{ value: "popular", label: "Popular", disabled: true },
			{ value: "curious", label: "Curious", disabled: true },
		]}
		trackingKey={`${trackingPrefix}:${analyticsKeys.chat.click.suggestionsCategory}`}
	/>
);
